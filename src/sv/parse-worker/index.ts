import {
  WorkBook, ParsingOptions, SheetLimitError, PasswordProtectedError
} from '@handsontable/js-xlsx';

import { Right, Left, Either } from 'purify-ts/Either';
import { parseData } from './parse';
import {
  DownloadErrorCode, downloadUrlToPartialResponse, continuePartialResponse
} from './download';

import type { WorkbookInput } from '../use-workbook';
import {
  getExtensionFromFilename, getFiletypeFromExtension, FileFormatSupportLevel, workbookMimeTypesToExtensions
} from '../filetype';

const maxFileSize = 10_000_000; // 10MB

type ParseWorkerInputInitialize = {
  type: 'initialize',

  /**
   * A unique id generated "client" side, as in outside of this worker.
   */
  workbookId: string,

  workbookInput: WorkbookInput

  /**
   * Whether to force continue parsing workbooks that we don't support yet.
   */
  moreformats: boolean
};

type ParseWorkerInputLoadSheet = {
  type: 'loadSheet'

  /**
   * The same `workbookId` passed into the `initialize` input message.
   */
  workbookId: string,

  sheet: number
};

export type ParseWorkerInput = ParseWorkerInputInitialize | ParseWorkerInputLoadSheet;

type ParseWorkerOutputInitialized = {
  type: 'initialized',

  /**
   * The same `workbookId` passed into the `initialize` input message.
   */
  workbookId: string

  sheetNames: string[]
  fileSize: number
};

type ParseWorkerErrorCode =
  | 'download-status'
  | 'download-timeout'
  | 'download-network'
  | 'download-filesize'
  | 'unsupported non-workbook file'
  | 'unsupported workbook file'
  | 'filesize'
  | 'parser'
  | 'parser-sheet-limit'
  | 'parser-password-protected'
  | 'cache-integrity';

type ParseWorkerOutputError = {
  type: 'error',
  code: ParseWorkerErrorCode
};

type ParseWorkerOutputParsedWorkbook = {
  type: 'parsedWorkbook',

  /**
   * The same `workbookId` passed into the `initialize` input message.
   */
  workbookId: string

  sheet: number

  workbook: WorkBook,
};

export type ParseWorkerOutput =
  | ParseWorkerOutputInitialized
  | ParseWorkerOutputError
  | ParseWorkerOutputParsedWorkbook;

export type ParseWorker = WebpackWorker<ParseWorkerInput, ParseWorkerOutput>;

const downloadCodeToParseErrorCode = (downloadErrorCode: DownloadErrorCode): ParseWorkerErrorCode => ({
  status: 'download-status' as const,
  timeout: 'download-timeout' as const,
  network: 'download-network' as const,
  filesize: 'download-filesize' as const
})[downloadErrorCode];

type PartialParsingFn = (opts: ParsingOptions) => WorkBook;
const partialParsingFnCache = new Map<string, PartialParsingFn>();

const getFiletypeFromFilename = (filename: string): FileFormatSupportLevel => {
  const extension = getExtensionFromFilename(filename);
  if (extension === undefined) {
    return 'unsupported non-workbook file';
  }

  return getFiletypeFromExtension(extension);
};

export const attach = (
  // The generic arguments to this `WebpackWorker` are reversed relative to
  // the main thread - since we're receiving the "input" messages here we
  // have to treat them as an output from the worker context.
  workerContext: WebpackWorker<ParseWorkerOutput, ParseWorkerInput>
) => {
  workerContext.onmessage = async(event) => {
    const { data } = event;
    if (data.type === 'initialize') {
      /* For some reason the indent linter has trouble with returning objects from arrow functions. */
      /* eslint-disable @typescript-eslint/indent */
      const { workbookInput, workbookId, moreformats } = data;

      const workbookArrayBufferEither = await (async(): Promise<Either<ParseWorkerErrorCode, ArrayBuffer>> => {
        if (workbookInput.type === 'arraybuffer') {
          const filetype = getFiletypeFromFilename(workbookInput.fileName);

          if (filetype === 'unsupported non-workbook file') {
            return Left('unsupported non-workbook file');
          }

          if (filetype === 'unsupported workbook file' && !moreformats) {
            return Left('unsupported workbook file');
          }

          return Right(workbookInput.arrayBuffer);
        }

        if (workbookInput.fileName !== undefined) {
          // If `fileName` is provided, always treat it as the source of truth
          // for determining the filetype
          const filetype = getFiletypeFromFilename(workbookInput.fileName);

          if (filetype === 'unsupported non-workbook file') {
            return Left('unsupported non-workbook file');
          }

          if (filetype === 'unsupported workbook file' && !moreformats) {
            return Left('unsupported workbook file');
          }
        }

        const partialResponseEither = await downloadUrlToPartialResponse(workbookInput.url, maxFileSize);
        const partialResponse = partialResponseEither.extract();

        if (typeof partialResponse === 'string') {
          return Left(partialResponse).mapLeft(downloadCodeToParseErrorCode);
        }

        if (workbookInput.fileName === undefined) {
          // If no `fileName` was provided, we must check the filetype based
          // on the mime type. If that's undefined, we assume that the file
          // is invalid.
          const { mimeType } = partialResponse;

          if (mimeType === undefined) {
            return Left('unsupported non-workbook file');
          }

          const extension = workbookMimeTypesToExtensions.get(mimeType);

          if (extension === undefined) {
            return Left('unsupported non-workbook file');
          }

          const filetype = getFiletypeFromExtension(extension);

          if (filetype === 'unsupported non-workbook file') {
            return Left('unsupported non-workbook file');
          }

          if (filetype === 'unsupported workbook file' && !moreformats) {
            return Left('unsupported workbook file');
          }
        }

        return (await continuePartialResponse(partialResponse)).mapLeft(downloadCodeToParseErrorCode);
      })();

      const result = workbookArrayBufferEither
        .chain((ab) => {
          if (ab.byteLength > maxFileSize) {
            return Left('filesize');
          }

          return Right(ab);
        })
        .map(ab => ({
          ab,
          fileSize: ab.byteLength
        })).chain(({ ab, fileSize }) => {
          try {
            const parsingResult = parseData(ab);

            // The "cache" shall only hold one, most recent, workbook at a
            // time.
            partialParsingFnCache.clear();

            partialParsingFnCache.set(
              workbookId,
              // Unless we receive a real function we have to create a
              // stub one here for simplicity's sake.
              typeof parsingResult === 'function'
                ? parsingResult
                : () => parsingResult
            );

            return Right({
              sheetNames: parsingResult.SheetNames,
              fileSize: ab.byteLength
            });
          } catch (error) {
            console.error('parse-worker:', error);
            console.error('parse-worker:', error?.stack);

            if (error instanceof SheetLimitError) {
              return Left('parser-sheet-limit');
            }

            if (error instanceof PasswordProtectedError) {
              return Left('parser-password-protected');
            }

            return Left('parser');
          }
        }).either<ParseWorkerOutput>(code => ({
          type: 'error',
          code
        }), ({ fileSize, sheetNames }) => ({
          type: 'initialized',
          workbookId,
          fileSize,
          sheetNames
        }));

      workerContext.postMessage(result);

      /* eslint-enable @typescript-eslint/indent */
    } else if (data.type === 'loadSheet') {
      const { workbookId, sheet } = data;

      const partialFunction = partialParsingFnCache.get(workbookId);

      if (partialFunction === undefined) {
        return workerContext.postMessage({
          type: 'error',
          code: 'cache-integrity'
        });
      }

      try {
        const workbook = partialFunction({
          sheets: [sheet]
        });

        workerContext.postMessage({
          type: 'parsedWorkbook',
          workbookId,
          sheet,
          workbook,
        });
      } catch (error) {
        console.error('parse-worker:', error);
        workerContext.postMessage({
          type: 'error',
          code: 'parser'
        });
      }
    }
  };
};
