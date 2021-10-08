import { CellRange, ViewName } from './MessagesShared';

/**
 * Callback message from Spreadsheet Viewer emitted when a sheet is changed by the end-user.
 */
export interface ActiveSheetChanged {
  name: 'activeSheetChanged';
  /**
   * A number, starting from 0, representing the index of the sheet within the document
   */
  sheet: number;
}

/**
 * Callback message from Spreadsheet Viewer emitted when a cells selection in ended by the end-user.
 */
export interface CellSelectionChanged {
  name: 'cellSelectionChanged';
  range: CellRange;
}

export interface ReadyForMessages {
  name: 'readyForMessages';
}

export interface ViewActivated {
  name: 'viewActivated';
  viewName: ViewName;
}

export interface KeyDown {
  name: 'keydown',
  key: string,
}

export interface KeyUp {
  name: 'keyup',
  key: string,
}

export interface Drop {
  name: 'drop',
  files: FileList
}

export interface DragOver {
  name: 'dragover',
}

export interface DragLeave {
  name: 'dragleave',
}

export type CallbackMessage =
  | ActiveSheetChanged
  | CellSelectionChanged
  | ReadyForMessages
  | ViewActivated
  | KeyDown
  | KeyUp
  | Drop
  | DragOver
  | DragLeave;
