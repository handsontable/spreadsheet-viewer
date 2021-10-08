import * as fileNames from '../../support/fileNames/xlsx';

context('Grid', () => {
  it(`should render "${fileNames.CUSTOM_DEFAULT_SIZES}"`, () => {
    cy.loadSheetInSV(fileNames.CUSTOM_DEFAULT_SIZES, 0);
    cy.assertColumnWidths([128, 128, 128, 200, 128]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TRIM_EMPTY_ROWS}"`, () => {
    cy.loadSheetInSV(fileNames.TRIM_EMPTY_ROWS, 0);
    cy.assertColumnWidths([213, 185, 185, 196, 121, 69, 80, 154, 80, 154, 80, 154, 80, 154, 100, 112, 73]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.CUSTOM_SIZES}"`, () => {
    cy.loadSheetInSV(fileNames.CUSTOM_SIZES, 0);
    cy.assertColumnWidths([155, 155, 155, 64, 64, 64, 179]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.HIDDEN_ROWS_AND_COLUMNS}"`, () => {
    cy.loadSheetInSV(fileNames.HIDDEN_ROWS_AND_COLUMNS, 0);
    cy.assertColumnWidths([64, 64, 64, 64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.GRIDLINE} - tab 0"`, () => {
    cy.loadSheetInSV(fileNames.GRIDLINE, 0);
    cy.assertColumnWidths([64, 212, 64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.GRIDLINE} - tab 0 with selected all cells"`, () => {
    cy.loadSheetInSV(fileNames.GRIDLINE, 0);
    cy.selectAllCells();
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.GRIDLINE} - tab 1"`, () => {
    cy.loadSheetInSV(fileNames.GRIDLINE, 1);
    cy.assertColumnWidths([64, 210, 64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.GRIDLINE} - tab 1 with selected all cells"`, () => {
    cy.loadSheetInSV(fileNames.GRIDLINE, 1);
    cy.selectAllCells();
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.GRIDLINE} with selection - tab 2"`, () => {
    cy.loadSheetInSV(fileNames.GRIDLINE, 2);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.GRIDLINE} with selection - tab 2 with selected all cells"`, () => {
    cy.loadSheetInSV(fileNames.GRIDLINE, 2);
    cy.selectAllCells();
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.GRIDLINE} with selection - tab 3"`, () => {
    cy.loadSheetInSV(fileNames.GRIDLINE, 3);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.GRIDLINE} with selection - tab 3 with selected all cells"`, () => {
    cy.loadSheetInSV(fileNames.GRIDLINE, 3);
    // select some random cell, just outside the frozen pane area
    cy.selectAllCells(100);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.HIDDEN_AND_FROZEN_COLUMNS}" - tab 0`, () => {
    cy.loadSheetInSV(fileNames.HIDDEN_AND_FROZEN_COLUMNS, 0);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.HIDDEN_AND_FROZEN_COLUMNS}" - tab 1`, () => {
    cy.loadSheetInSV(fileNames.HIDDEN_AND_FROZEN_COLUMNS, 1);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.HIDDEN_AND_FROZEN_COLUMNS}" - tab 2`, () => {
    cy.loadSheetInSV(fileNames.HIDDEN_AND_FROZEN_COLUMNS, 2);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.HIDDEN_AND_FROZEN_ROWS}" - tab 0`, () => {
    cy.loadSheetInSV(fileNames.HIDDEN_AND_FROZEN_ROWS, 0);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.HIDDEN_AND_FROZEN_ROWS}" - tab 1`, () => {
    cy.loadSheetInSV(fileNames.HIDDEN_AND_FROZEN_ROWS, 1);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.HIDDEN_AND_FROZEN_ROWS}" - tab 2`, () => {
    cy.loadSheetInSV(fileNames.HIDDEN_AND_FROZEN_ROWS, 2);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.HIDDEN_AND_FROZEN_ROWS}" - tab 3`, () => {
    cy.loadSheetInSV(fileNames.HIDDEN_AND_FROZEN_ROWS, 3);
    cy.assertColumnWidths([78, 128, 87, 111, 107, 107, 223]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TABLE}" - Light themes`, () => {
    cy.loadSheetInSV(fileNames.TABLE, 0);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TABLE}" - Medium themes`, () => {
    cy.loadSheetInSV(fileNames.TABLE, 1);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TABLE}" - Dark themes`, () => {
    cy.loadSheetInSV(fileNames.TABLE, 2);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.CUSTOMIZED_TABLE}"`, () => {
    cy.loadSheetInSV(fileNames.CUSTOMIZED_TABLE, 0);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  /** @link https://github.com/handsontable/spreadsheet-viewer-dev/issues/361 */
  it(`should render one by one: "${fileNames.TEXT_ALIGNMENT}" -> "${fileNames.STYLING}" -> "${fileNames.TEXT_ALIGNMENT}"`, () => {
    cy.loadSheetInSV(fileNames.TEXT_ALIGNMENT, 0);
    cy.matchWorkbookSnapshot();
    cy.loadSheetInSV(fileNames.STYLING, 0);
    cy.loadSheetInSV(fileNames.TEXT_ALIGNMENT, 0);
    cy.matchWorkbookSnapshot();

  });
  it(`should render "${fileNames.EMPTY_LIBREOFFICE}"`, () => {
    cy.loadSheetInSV(fileNames.EMPTY_LIBREOFFICE, 0);
    cy.assertColumnWidths([76, 81, 81, 81]);
    cy.matchWorkbookSnapshot();
  });
});

context('Pivot Table Styles', () => {
  it(`should render ${fileNames.STYLES_PIVOT_TABLE}`, () => {
    cy.loadSheetInSV(fileNames.STYLES_PIVOT_TABLE, 0);
    cy.matchWorkbookSnapshot();
  });
});
