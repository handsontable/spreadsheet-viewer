import type { WorkbookInput } from './use-workbook';

export type FileFormatSupportLevel =
  | 'supported workbook file'
  | 'unsupported workbook file'
  | 'unsupported non-workbook file';

/**
 * Every supported workbook extension, viewable without a flag.
 */
const supportedWorkbookExtensions = ['xlsx', 'xltx'];

/**
 * Every workbook extension that either support or might support in the
 * future.
 */
const workbookExtensions = ['xlsx', 'xls', 'xla', 'xlt', 'xltx', 'xlsm', 'xltm', 'xlam', 'xlsb', 'ods', 'numbers'] as const; // Obviously, to be expanded.
type WorkbookExtension = typeof workbookExtensions[number];

const isWorkbookExtension = (str: string): str is WorkbookExtension => {
  return (workbookExtensions as readonly string[]).includes(str);
};

/**
 * A mapping from workbook mime types to extensions that we either support or
 * will support in the future. Data taken mostlyfrom the `mime` module.
 *
 * Note that this is not a perfect solution, because mime types and extensions
 * don't have a 1:1 correspondance (e.g. `application/vnd.ms-excel` can
 * represent both `xls` and `xlt` files). This is not considered a big drawback
 * at the moment of writing since the files with faulty flags are under a flag
 * anyway, and `xlsx` has a pretty descriptive and non-ambiguous mime type.
 *
 * Keep in sync with src/cors-proxy/index.js
 */
export const workbookMimeTypesToExtensions: ReadonlyMap<string, WorkbookExtension> = new Map([
  ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx'],
  ['application/vnd.ms-excel', 'xls'],
  ['application/vnd.openxmlformats-officedocument.spreadsheetml.template', 'xltx'],
  ['application/vnd.ms-excel.sheet.macroenabled.12', 'xlsm'],
  ['application/vnd.ms-excel.template.macroenabled.12', 'xltm'],
  ['application/vnd.ms-excel.addin.macroenabled.12', 'xlam'],
  ['application/vnd.ms-excel.sheet.binary.macroenabled.12', 'xlsb'],
  ['application/vnd.oasis.opendocument.spreadsheet', 'ods'],
  ['application/x-iwork-numbers-sffnumbers', 'numbers'],
  ['application/vnd.apple.numbers', 'numbers']
]);

const lastElementOfArray = <T>(array: T[]): T | undefined => (array.length > 0 ? array[array.length - 1] : undefined);

export const getExtensionFromFilename = (filename: string): string | undefined => {
  const split = filename.split('.');
  return split.length > 1 ? lastElementOfArray(split) : undefined;
};

export const getFiletypeFromExtension = (extension: string): FileFormatSupportLevel => {
  const lower = extension.toLowerCase();

  if (supportedWorkbookExtensions.includes(lower)) {
    return 'supported workbook file';
  }

  if (isWorkbookExtension(lower)) {
    return 'unsupported workbook file';
  }

  return 'unsupported non-workbook file';
};

export const getFilenameFromUrl = (url: string): string | undefined => {
  if (url.startsWith('data:')) {
    return undefined;
  }

  const lastSegmentOfUrl = url.split('/').pop();

  if (lastSegmentOfUrl === undefined || lastSegmentOfUrl.length === 0) {
    return undefined;
  }

  return lastSegmentOfUrl;
};

export const getFilenameFromWorkbookInput = (input: WorkbookInput): string | undefined => {
  if (input.fileName !== undefined) {
    return input.fileName;
  }

  if (input.type === 'arraybuffer') {
    return input.fileName;
  }

  return getFilenameFromUrl(input.url);
};

export const unnamedFilename = 'Unnamed file';
