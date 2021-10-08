
import * as fileNames from '../../support/fileNames/xlsx';

/**
 * @link https://github.com/handsontable/spreadsheet-viewer-dev/wiki/Displayed-cell-range [Wiki "Displayed cell range"]
 * @link https://github.com/handsontable/spreadsheet-viewer-dev/issues/21 [Issue #21]
 * @link https://github.com/handsontable/spreadsheet-viewer-dev/issues/350 [Issue #350]
 */
context('Limits', () => {
  it(`should render "${fileNames.MERGED_COLUMN}"`, () => {
    cy.loadSheetInSV(fileNames.MERGED_COLUMN, 0);
    cy.matchWorkbookSnapshot();
  });
  it(`should render "${fileNames.MERGED_ROW}"`, () => {
    cy.loadSheetInSV(fileNames.MERGED_ROW, 0);
    cy.matchWorkbookSnapshot();
  });
  it(`should render "${fileNames.MERGED_ROW_CONTENT}"`, () => {
    cy.loadSheetInSV(fileNames.MERGED_ROW_CONTENT, 0);
    cy.matchWorkbookSnapshot();
  });
  it(`should render "${fileNames.COLUMNS_OVER_LIMIT}"`, () => {
    cy.loadSheetInSV(fileNames.COLUMNS_OVER_LIMIT, 0);
    cy.matchWorkbookSnapshot();
  });
  it(`should render "${fileNames.MERGED_COLUMN_CONTENT}"`, () => {
    cy.loadSheetInSV(fileNames.MERGED_COLUMN_CONTENT, 0);
    cy.matchWorkbookSnapshot();
  });
  it(`should render "${fileNames.OBJECTS_151}"`, () => {
    cy.loadSheetInSV(fileNames.OBJECTS_151, 0);
    cy.matchWorkbookSnapshot();
  });

  // this test is now failing because we render 10000 rows in HOT in the "fullPageMode" and this file contains values in 10000 rows
  // it(`should render "${fileNames.ROWS_OVER_LIMIT}"`, () => {
  //   cy.loadSheetInSV(fileNames.ROWS_OVER_LIMIT, 0);
  //   cy.matchWorkbookSnapshot();
  // });
  // todo bug: out-of-memory; probably this issue: https://github.com/handsontable/spreadsheet-viewer-dev/issues/351
  // it(`should render "${fileNames.ROWS_AND_COLUMNS_OVER_LIMIT}"`, () => {
  //   cy.loadSheetInSV(fileNames.ROWS_AND_COLUMNS_OVER_LIMIT, 0);
  //   cy.matchWorkbookSnapshot();
  // });
  // it(`should render "${fileNames.ROWS_AND_COLUMNS_OVER_LIMIT}" - scrolled to the center`, () => {
  //   cy.loadSheetInSV(fileNames.ROWS_AND_COLUMNS_OVER_LIMIT, 0);
  //   cy.matchWorkbookSnapshot();
  // });
  // it(`should render "${fileNames.ROWS_AND_COLUMNS_OVER_LIMIT}" - scrolled to the bottom`, () => {
  //   cy.loadSheetInSV(fileNames.ROWS_AND_COLUMNS_OVER_LIMIT, 0);
  //   cy.matchWorkbookSnapshot();
  // });
});

context(fileNames.CONTENT_AREA, () => {
  // TODO: fix tab 0, 1, 2, 4 in a future epic https://github.com/handsontable/spreadsheet-viewer-dev/issues/529
  it('should render tab 0', () => {
    cy.loadSheetInSV(fileNames.CONTENT_AREA, 0);
    cy.matchWorkbookSnapshot();
  });
  it('should render tab 1', () => {
    cy.loadSheetInSV(fileNames.CONTENT_AREA, 1);
    cy.matchWorkbookSnapshot();
  });
  it('should render tab 2', () => {
    cy.loadSheetInSV(fileNames.CONTENT_AREA, 2);
    cy.matchWorkbookSnapshot();
  });
  it('should render tab 3', () => {
    cy.loadSheetInSV(fileNames.CONTENT_AREA, 3);
    cy.matchWorkbookSnapshot();
  });
  it('should render tab 4', () => {
    cy.loadSheetInSV(fileNames.CONTENT_AREA, 4);
    cy.matchWorkbookSnapshot();
  });
  it('should render tab 5', () => {
    cy.loadSheetInSV(fileNames.CONTENT_AREA, 5);
    cy.matchWorkbookSnapshot();
  });
  it('should render tab 6', () => {
    cy.loadSheetInSV(fileNames.CONTENT_AREA, 6);
    cy.matchWorkbookSnapshot();
  });
});
