/* eslint-disable max-classes-per-file */

/**
 * Error codes that can be passed in as Query String API parameters.
 */
export enum SimulateErrorCodes {
  RENDER_ERROR = 'RENDER_ERROR',
  INTERPRETER_ERROR = 'INTERPRETER_ERROR',
  REACT_INITIALIZATION_ERROR = 'REACT_INITIALIZATION_ERROR'
}

type ErrorCode =
  | 'UNSUPPORTED_FILE_FORMAT_ERROR'
  | 'UNSUPPORTED_WORKBOOK_FORMAT_ERROR'
  | 'FILE_LOADING_STATUS_ERROR'
  | 'FILE_LOADING_MIME_TYPE_ERROR'
  | 'FILE_LOADING_TIMEOUT_ERROR'
  | 'FILE_LOADING_NETWORK_ERROR'
  | 'FILE_SIZE_ERROR'
  | 'PARSER_ERROR'
  | 'SHEET_LIMIT_ERROR'
  | 'INTERPRETER_ERROR'
  | 'RENDER_ERROR'
  | 'WORKER_CACHE_INTEGRITY_ERROR'
  | 'INVALID_QUERY_STRING_API_PARAMETER_ERROR'
  | 'INVALID_REQUEST_MESSAGE_ERROR'
  | 'FILE_PROTECTION_ERROR'
  | 'UNKNOWN_ERROR';
// Our base class that we know we can throw and handle correctly.
export class SpreadsheetViewerError extends Error {}

// All the different error classes our app can throw or create.
const SVE = SpreadsheetViewerError;
export class UnsupportedFileFormatError extends SVE {}
export class UnsupportedWorkbookFormatError extends SVE {}
export class FileLoadingStatusError extends SVE {}
export class FileLoadingMimeTypeError extends SVE {}
export class FileLoadingTimeoutError extends SVE {}
export class FileLoadingNetworkError extends SVE {}
export class FileSizeError extends SVE {}
export class ParserError extends SVE {}
export class ParserSheetLimitError extends SVE {}
export class InterpreterError extends SVE {}
export class RenderError extends SVE {}
export class WorkerCacheIntegrityError extends SVE {}
export class InvalidQueryStringApiParameterError extends SVE {}
export class InvalidRequestMessageError extends SVE {}
export class FileProtectionError extends SVE {}

/**
 * Error codes at the moment serve no use other than being something to
 * display to users.
 */
export const getErrorCodeFromError = (e: unknown): ErrorCode => {
  if (e instanceof UnsupportedFileFormatError) {
    return 'UNSUPPORTED_FILE_FORMAT_ERROR';
  }

  if (e instanceof UnsupportedWorkbookFormatError) {
    return 'UNSUPPORTED_WORKBOOK_FORMAT_ERROR';
  }

  if (e instanceof FileLoadingStatusError) {
    return 'FILE_LOADING_STATUS_ERROR';
  }

  if (e instanceof FileLoadingMimeTypeError) {
    return 'FILE_LOADING_MIME_TYPE_ERROR';
  }

  if (e instanceof FileLoadingTimeoutError) {
    return 'FILE_LOADING_TIMEOUT_ERROR';
  }

  if (e instanceof FileLoadingNetworkError) {
    return 'FILE_LOADING_NETWORK_ERROR';
  }

  if (e instanceof FileSizeError) {
    return 'FILE_SIZE_ERROR';
  }

  if (e instanceof ParserError) {
    return 'PARSER_ERROR';
  }

  if (e instanceof ParserSheetLimitError) {
    return 'SHEET_LIMIT_ERROR';
  }

  if (e instanceof InterpreterError) {
    return 'INTERPRETER_ERROR';
  }

  if (e instanceof RenderError) {
    return 'RENDER_ERROR';
  }

  if (e instanceof WorkerCacheIntegrityError) {
    return 'WORKER_CACHE_INTEGRITY_ERROR';
  }

  if (e instanceof InvalidQueryStringApiParameterError) {
    return 'INVALID_QUERY_STRING_API_PARAMETER_ERROR';
  }

  if (e instanceof InvalidRequestMessageError) {
    return 'INVALID_REQUEST_MESSAGE_ERROR';
  }

  if (e instanceof FileProtectionError) {
    return 'FILE_PROTECTION_ERROR';
  }

  return 'UNKNOWN_ERROR';
};

export const getErrorTextFromErrorCode = (errorCode: ErrorCode) => {
  if (errorCode === 'FILE_PROTECTION_ERROR') {
    return 'We cannot display password protected files yet. \n Please use the below button to download the file.';
  }
  if (errorCode === 'UNSUPPORTED_WORKBOOK_FORMAT_ERROR') {
    return 'Sorry, this workbook file format is not supported yet.';
  }
  if (errorCode === 'UNSUPPORTED_FILE_FORMAT_ERROR') {
    return 'Sorry, this file cannot be previewed.';
  }

  return 'Sorry, we can\'t present you a preview of this file right now';
};
