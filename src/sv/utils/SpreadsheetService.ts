const COLUMN_LABEL_BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const COLUMN_LABEL_BASE_LENGTH = COLUMN_LABEL_BASE.length;

// `spreadsheetColumn*` functions copied from
// `handsontable/src/helpers/data.js` in order to avoid the
// (almost whole) handsontable source was unavoidable even when importing
// `submodules/handsontable/src/helpers/data` directly.
export function spreadsheetColumnLabel(index: number) {
  let dividend = index + 1;
  let columnLabel = '';
  let modulo: number;

  while (dividend > 0) {
    modulo = (dividend - 1) % COLUMN_LABEL_BASE_LENGTH;
    columnLabel = String.fromCharCode(65 + modulo) + columnLabel;
    dividend = parseInt(((dividend - modulo) / COLUMN_LABEL_BASE_LENGTH as unknown as string), 10);
  }

  return columnLabel;
}

export function spreadsheetColumnIndex(label: string) {
  let result = 0;

  if (label) {
    for (let i = 0, j = label.length - 1; i < label.length; i += 1, j -= 1) {
      result += (COLUMN_LABEL_BASE_LENGTH ** j) * (COLUMN_LABEL_BASE.indexOf(label[i]) + 1);
    }
  }
  result -= 1;

  return result;
}
/**
 * This is needed for testing snapshots in Cypress.
 */
export const attachSheetCountToBody = (isFullPageTesting: boolean, sheetCount: number) => {
  if (isFullPageTesting && !document.body.dataset.sheetCount) {
    document.body.dataset.sheetCount = sheetCount.toString();
  }
};
