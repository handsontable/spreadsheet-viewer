import type { SpreadsheetViewerInstance } from '~/../../dist/client-library/clientLibrary';

const keysCurrentlyDown = {};
const altKey = 'Alt';
const shiftKey = 'Shift';

/**
 * Listener should be added to SV window and demo app window.
 * When event is added only to the SV window then it is hard to make Cypress aware of key event.
 */
export const installKeyboardCellsSelection = (hostWindow: Window, svInstance: SpreadsheetViewerInstance) => {
  /**
 * The function sends a post message with select cells when SHIFT and ALT are clicked at the same time
 */
  const toggleSelectionOnHotKey = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    const key = event.key || event.keyCode || event.detail.key;

    keysCurrentlyDown[key] = event.type === 'keydown';

    if (keysCurrentlyDown[altKey] && keysCurrentlyDown[shiftKey]) {
      svInstance.selectCells([0, 0, 1, 1]); // Select 4 cells: A1, A2, B1, B2
    }
  };

  hostWindow.addEventListener('keydown', toggleSelectionOnHotKey);
  hostWindow.addEventListener('keyup', toggleSelectionOnHotKey);
};

