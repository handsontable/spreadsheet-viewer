// A React hook used to manage a workbook. Includes parsing the workbook
// through a Worker, parsing individual sheets on demand and the state
// machine responsible for dispatching those actions at appropriate times.

import { useReducer, useEffect, useCallback } from 'react';

import { ParsedData, fixupData } from './utils/FileService';

import type { ParseWorker, ParseWorkerOutput } from './parse-worker';
import { startPerfMarker, MARKERS, endPerfMarker } from '../../perf/markers';
import { emitActiveSheetChanged } from './utils/CallbackMessageEmitters';
import { SpreadsheetViewerError } from './error';
import * as errors from './error';
import * as sheetHistory from './sheet-history';
import type { SvId } from './sv-id';

export type WorkbookInput = {
  type: 'arraybuffer'
  arrayBuffer: ArrayBuffer
  fileName: string
} | {
  type: 'url'
  url: string
  fileName?: string
};

export type SheetStateLoading = {
  type: 'loading'
};

export type SheetStateReady = {
  type: 'ready'
  parsedData: ParsedData
};

export type SheetState =
  | SheetStateLoading
  | SheetStateReady;

export type WorkbookStateEmpty = undefined;

export type WorkbookStateInitialising = {
  type: 'initialising',

  workbookId: string
  input: WorkbookInput
  desiredSheet: number
};

export type WorkbookStateReady = {
  type: 'ready',

  workbookId: string
  input: WorkbookInput

  /**
   * This property is an array that points to a "history" of selected sheets,
   * ordered from least recent sheets to most recent sheets.
   *
   * This mechanism allows users to:
   *   - always see some sheet content (other than at initial load)
   *   - click around tabs quickly without lag (other than Handsontable render)
   */
  sheetHistory: sheetHistory.SheetHistory

  fileSize: number
  sheetNames: string[]
  sheets: Map<number, SheetState>
};

export type WorkbookState =
  | WorkbookStateEmpty
  | WorkbookStateInitialising
  | WorkbookStateReady;

type ActionInitialize = {
  type: 'initialize',
  workbookId: string
  workbookInput: WorkbookInput
  sheet: number
};

type ActionInitialized = {
  type: 'initialized',
  workbookId: string
  sheetNames: string[]
  fileSize: number
};

type ActionChangeCurrentSheet = {
  type: 'changeCurrentSheet',
  sheet: number
};

type ActionStartLoadingSheet = {
  type: 'startLoadingSheet',
  sheet: number
};

type ActionUpdateWorkbook = {
  type: 'updateWorkbook'
  workbookId: string
  sheet: number
  parsedData: ParsedData
};

type Action =
  | ActionInitialize
  | ActionInitialized
  | ActionChangeCurrentSheet
  | ActionStartLoadingSheet
  | ActionUpdateWorkbook;

const reducer = (oldState: WorkbookState, action: Action): WorkbookState => {
  switch (action.type) {
    case 'initialize': {
      return {
        type: 'initialising',
        workbookId: action.workbookId,
        input: action.workbookInput,
        desiredSheet: action.sheet,
      };
    }

    case 'initialized': {
      // Dismiss if the received workbook is not the current one that was
      // requested
      if (oldState?.workbookId !== action.workbookId) {
        return oldState;
      }

      if (oldState.type !== 'initialising') {
        return oldState;
      }

      const clampSheetWithWarning = (max: number, desired: number): number => {
        if (desired < 0) {
          console.warn(`Desired sheet (${desired}) was lower than 0`);
          return 0;
        }

        if (desired > max) {
          console.warn(`Desired sheet (${desired}) was larger than the amount of sheets present in the current workbook (${max})`);
          return max;
        }

        return desired;
      };

      return {
        type: 'ready',
        workbookId: oldState.workbookId,
        input: oldState.input,
        sheetHistory: sheetHistory.init(clampSheetWithWarning(
          action.sheetNames.length - 1,
          oldState.desiredSheet
        )),
        fileSize: action.fileSize,
        sheets: new Map(),
        sheetNames: action.sheetNames
      };
    }

    case 'updateWorkbook': {
      if (oldState?.type !== 'ready') {
        return oldState;
      }

      if (oldState.sheets.get(action.sheet)?.type !== 'loading') {
        return oldState;
      }

      return {
        ...oldState,
        sheets: oldState.sheets.set(action.sheet, {
          type: 'ready',
          parsedData: action.parsedData
        })
      };
    }

    case 'startLoadingSheet': {
      if (oldState?.type !== 'ready') {
        return oldState;
      }

      // If the sheet is already loaded, skip it
      if (oldState.sheets.get(action.sheet) !== undefined) {
        return oldState;
      }

      return {
        ...oldState,
        sheets: oldState.sheets.set(action.sheet, {
          type: 'loading'
        })
      };
    }

    case 'changeCurrentSheet': {
      if (oldState?.type !== 'ready') {
        return oldState;
      }

      return {
        ...oldState,
        sheetHistory: oldState.sheetHistory.selectSheet(action.sheet)
      };
    }

    default: {
      throw new TypeError(`useWorkbook: Invalid action (${action})`);
    }
  }
};

export type UseWorkbookProps = {
  /**
   * The Worker that will be used to parse the files. This gets passed in from
   * above so as to allow us to use different workers for both modern and
   * legacy browsers.
   */
  parseWorker: ParseWorker

  /**
   * Error callback used to handle errors returned from the worker.
   */
  onError: (error: SpreadsheetViewerError) => void

  /**
   * Whether to force continue parsing workbooks that we don't support yet.
   * See https://github.com/handsontable/spreadsheet-viewer-dev/issues/752#issuecomment-713773497
   */
  moreformats: boolean

  svId: SvId
};

export const useWorkbook = (props: UseWorkbookProps) => {
  const {
    moreformats, parseWorker, onError, svId
  } = props;

  const [workbookState, dispatch] = useReducer(reducer, undefined);

  // This is needed for the eslint-plugin-react-hooks to not complain about
  // a missing dependencies
  const maybeSheets = workbookState?.type === 'ready' && workbookState.sheets;
  const maybeCurrentSheet: number | undefined = workbookState?.type === 'ready' ? workbookState.sheetHistory.latestSheet : undefined;

  // Attach a message handler to the worker.
  useEffect(() => {
    const workerMessageListener = ({ data }: {data: ParseWorkerOutput}) => {
      if (data.type === 'initialized') {
        dispatch({
          type: 'initialized',
          workbookId: data.workbookId,
          fileSize: data.fileSize,
          sheetNames: data.sheetNames
        });
      } else if (data.type === 'error') {
        const error = {
          'download-status': new errors.FileLoadingStatusError(),
          'download-timeout': new errors.FileLoadingTimeoutError(),
          'download-network': new errors.FileLoadingNetworkError(),
          'download-filesize': new errors.FileSizeError(),
          'unsupported non-workbook file': new errors.UnsupportedFileFormatError(),
          'unsupported workbook file': new errors.UnsupportedWorkbookFormatError(),
          filesize: new errors.FileSizeError(),
          parser: new errors.ParserError(),
          'parser-sheet-limit': new errors.ParserSheetLimitError(),
          'parser-password-protected': new errors.FileProtectionError(),
          'cache-integrity': new errors.WorkerCacheIntegrityError()
        }[data.code];

        onError(error);
      } else if (data.type === 'parsedWorkbook') {
        const { workbook, sheet, workbookId } = data;

        // PARSER
        endPerfMarker(MARKERS.parserReading);
        startPerfMarker(MARKERS.parserFixing);
        console.log('File authored with:', `${workbook.Props?.Application} (${workbook.Props?.AppVersion})`);

        const parsedData = fixupData(workbook);
        endPerfMarker(MARKERS.parserFixing);
        endPerfMarker(MARKERS.parser);

        dispatch({
          type: 'updateWorkbook',
          workbookId,
          sheet,
          parsedData
        });
      }
    };

    parseWorker.addEventListener('message', workerMessageListener);
    return () => parseWorker.removeEventListener('message', workerMessageListener);
  }, [parseWorker, onError]);

  // Watches the current workbook's sheet state and sends messages to the
  // `parseWorker` when it's necessary to load a new sheet.
  useEffect(() => {
    if (workbookState?.type !== 'ready' || !maybeSheets || maybeCurrentSheet === undefined) {
      return;
    }

    const currentSheet = maybeCurrentSheet;

    if (maybeSheets.get(currentSheet) === undefined) {
      dispatch({
        type: 'startLoadingSheet',
        sheet: currentSheet
      });

      parseWorker.postMessage({
        type: 'loadSheet',
        sheet: currentSheet,
        workbookId: workbookState.workbookId
      });
    }
  }, [
    workbookState?.workbookId,
    maybeCurrentSheet,
    maybeSheets,
    workbookState?.type,
    parseWorker
  ]);

  // Emit the active sheet to the global `window` object when it's changed
  useEffect(() => {
    if (maybeCurrentSheet !== undefined) {
      emitActiveSheetChanged(svId, maybeCurrentSheet);
    }
  }, [maybeCurrentSheet, svId]);

  // Callbacks to let the outside component logic trigger actions on this
  // hook

  /*
   * Change the current sheet in the current workbook. Does nothing if
   * there's no workbook ready.
   */
  const changeCurrentSheet = useCallback((sheet: number) => dispatch({
    type: 'changeCurrentSheet',
    sheet
  }), []);

  /*
   * Initialize a new workbook. This will trigger a download if a remote url
   * is passed in.
   */
  const loadWorkbook = useCallback((input: WorkbookInput, sheet: number = 0) => {
    const workbookId = Math.random().toString(32).substring(2);

    dispatch({
      type: 'initialize',
      workbookId,
      workbookInput: input,
      sheet
    });

    startPerfMarker(MARKERS.parser);
    startPerfMarker(MARKERS.parserReading);

    parseWorker.postMessage({
      type: 'initialize',
      workbookId,
      workbookInput: input,
      moreformats
    });
  }, [parseWorker, moreformats]);

  /**
   * Points to the latest sheet that has data ready. If no such sheet is
   * found, undefined. This is useful for ensuring that you always present
   * something to the user (other than on the initial load).
   */
  const latestLoadedSheet: number | undefined = (() => {
    if (workbookState?.type !== 'ready') {
      return undefined;
    }

    const loadedSheetIndices = [...workbookState.sheets.entries()].filter(([_, state]) => state.type === 'ready').map(([index]) => index);

    return workbookState.sheetHistory.getLatestLoadedSheet(loadedSheetIndices);
  })();

  return {
    workbookState,
    changeCurrentSheet,
    loadWorkbook,
    latestLoadedSheet
  };
};
