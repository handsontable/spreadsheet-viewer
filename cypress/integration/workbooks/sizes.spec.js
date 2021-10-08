
import * as fileNames from '../../support/fileNames/xlsx';

/**
 * @link https://github.com/handsontable/spreadsheet-viewer-dev/issues/313 [Issue #313]
 */
context('Sizes', () => {
  it(`should render "${fileNames.SIZES_DEFAULT_COL_88PX_EMPTY}"`, () => {
    cy.loadSheetInSV(fileNames.SIZES_DEFAULT_COL_88PX_EMPTY, 0);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.SIZES_DEFAULT_COL_100PX_EMPTY}"`, () => {
    cy.loadSheetInSV(fileNames.SIZES_DEFAULT_COL_100PX_EMPTY, 0);
    cy.assertColumnWidths([100, 100, 100]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.SIZES_DEFAULT_COL_AND_ROW_EMPTY}"`, () => {
    cy.loadSheetInSV(fileNames.SIZES_DEFAULT_COL_AND_ROW_EMPTY, 0);
    cy.assertColumnWidths([103, 103, 103]);
    cy.matchWorkbookSnapshot();
  });
});
