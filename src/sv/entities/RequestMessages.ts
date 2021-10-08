import {
  Codec, exactly, string, optional, number, GetInterface, oneOf
} from 'purify-ts/Codec';
import { Right, Left } from 'purify-ts/Either';
import { CellRange, ConfigurationProps } from './MessagesShared';

const ArrayBufferCodec = Codec.custom<ArrayBuffer>({
  decode: value => ((value instanceof ArrayBuffer) ? Right(value) : Left('Specified value isn\'t an instance of ArrayBuffer')),
  encode: ab => ab
});

/**
 * A data URL string, a remote URL, or an ArrayBuffer representing the file
 * contents.
 */
export const WorkbookLocation = oneOf([string, ArrayBufferCodec]);
export type WorkbookLocation = GetInterface<typeof WorkbookLocation>;

/**
 * Request message to Spreadsheet Viewer to render a file.
 */
export const loadWorkbook = 'loadWorkbook';
const loadWorkbookCommon = {
  name: exactly(loadWorkbook),

  /**
   * A number, starting from 0, representing the index of the sheet within the document. Default value: 0
   */
  sheet: number,
};
export const LoadWorkbook = oneOf([Codec.interface({
  workbook: ArrayBufferCodec,

  // If the provided `workbook` is an ArrayBuffer, `fileName` becomes
  // non-optional.
  fileName: string,
  ...loadWorkbookCommon
}), Codec.interface({
  workbook: string,
  fileName: optional(string),
  ...loadWorkbookCommon
})]);
export type LoadWorkbook = GetInterface<typeof LoadWorkbook>;

/**
 * Request message from end-user that request selecting cells in the SV.
 */
export const selectCells = 'selectCells';
export const SelectCells = Codec.interface({
  name: exactly(selectCells),
  range: CellRange
});
export type SelectCells = GetInterface<typeof SelectCells>;

/**
 * Request message that request switching theme colors in the SV to `light` or `dark`.
 */
export const configure = 'configure';
export const Configure = Codec.interface({ name: exactly(configure), ...ConfigurationProps });
export type Configure = GetInterface<typeof Configure>;

export type RequestMessage = LoadWorkbook | SelectCells | Configure;
