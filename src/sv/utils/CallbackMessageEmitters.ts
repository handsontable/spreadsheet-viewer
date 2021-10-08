import {
  ActiveSheetChanged,
  CellSelectionChanged,
  ReadyForMessages,
  KeyDown,
  KeyUp,
  Drop,
  DragLeave,
  DragOver,
  ViewActivated
} from '../entities/CallbackMessages';
import { CellRange, ViewName } from '../entities/MessagesShared';
import { SvId, value as svIdValue } from '../sv-id';

const ACTIVE_SHEET_CHANGED = 'activeSheetChanged';
const CELL_SELECTION_CHANGED = 'cellSelectionChanged';
const READY_FOR_MESSAGES = 'readyForMessages';
const KEY_DOWN = 'keydown';
const KEY_UP = 'keyup';
const VIEW_ACTIVATED = 'viewActivated';
const DROP = 'drop';
const DRAG_OVER = 'dragover';
const DRAG_LEAVE = 'dragleave';

type SupportedEvents = ActiveSheetChanged | CellSelectionChanged | ReadyForMessages
| KeyDown | KeyUp | Drop | DragOver | DragLeave | ViewActivated;

const postFrameMessage = (svId: SvId, event: SupportedEvents) => {
  window.parent.postMessage({ ...event, id: svIdValue(svId) }, '*');
};

export const emitActiveSheetChanged = (svId: SvId, sheet: number) => {
  postFrameMessage(svId, {
    name: ACTIVE_SHEET_CHANGED,
    sheet
  });
};

export const emitSelectionDetails = (svId: SvId, range: CellRange) => {
  postFrameMessage(svId, {
    name: CELL_SELECTION_CHANGED,
    range
  });
};

export const emitReadyForMessages = (svId: SvId) => {
  postFrameMessage(svId, {
    name: READY_FOR_MESSAGES
  });
};

export const emitViewActivated = (svId: SvId, viewName: ViewName) => {
  postFrameMessage(svId, {
    name: VIEW_ACTIVATED,
    viewName
  });
};

export const emitKeyDown = (svId: SvId, key: string) => {
  postFrameMessage(svId, {
    name: KEY_DOWN,
    key
  });
};

export const emitKeyUp = (svId: SvId, key: string) => {
  postFrameMessage(svId, {
    name: KEY_UP,
    key
  });
};

export const emitDrop = (svId: SvId, files: FileList) => {
  postFrameMessage(svId, {
    name: DROP,
    files
  });
};

export const emitDragOver = (svId: SvId) => {
  postFrameMessage(svId, {
    name: DRAG_OVER
  });
};

export const emitDragLeave = (svId: SvId) => {
  postFrameMessage(svId, {
    name: DRAG_LEAVE
  });
};

export const reEmitWindowInteractionEvents = (svId: SvId, _window: Window) => {
  _window.addEventListener('keydown', e => emitKeyDown(svId, e.key));
  _window.addEventListener('keyup', e => emitKeyUp(svId, e.key));
  _window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer) {
      emitDrop(svId, e.dataTransfer.files);
    }
  });
  _window.addEventListener('dragover', (e) => { e.preventDefault(); emitDragOver(svId); });
  _window.addEventListener('dragleave', e => emitDragLeave(svId));
};
