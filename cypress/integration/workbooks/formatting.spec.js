import * as fileNames from '../../support/fileNames/xlsx';

context('Formatting', () => {
  it(`should render "${fileNames.STYLING}"`, () => {
    cy.loadSheetInSV(fileNames.STYLING, 0);
    cy.assertColumnWidths([425, 89, 62]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.ROW_COLUMN_BORDER}" - tab 0`, () => {
    cy.loadSheetInSV(fileNames.ROW_COLUMN_BORDER, 0);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.ROW_COLUMN_BORDER}" - tab 1`, () => {
    cy.loadSheetInSV(fileNames.ROW_COLUMN_BORDER, 1);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.ROW_COLUMN_FILL}" - tab 0`, () => {
    cy.loadSheetInSV(fileNames.ROW_COLUMN_FILL, 0);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.ROW_COLUMN_FILL}" - tab 1`, () => {
    cy.loadSheetInSV(fileNames.ROW_COLUMN_FILL, 1);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.SHEET_ROW_COLUMN_STYLING}"`, () => {
    cy.loadSheetInSV(fileNames.SHEET_ROW_COLUMN_STYLING, 0);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.CELL_TYPES}"`, () => {
    cy.loadSheetInSV(fileNames.CELL_TYPES, 0);
    cy.assertColumnWidths([699, 194, 199, 199, 62]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.FUNCTIONS}"`, () => {
    cy.loadSheetInSV(fileNames.FUNCTIONS, 0);
    cy.assertColumnWidths([694, 166, 166]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.LANGUAGES_AND_CHARS}"`, () => {
    cy.loadSheetInSV(fileNames.LANGUAGES_AND_CHARS, 0);
    cy.assertColumnWidths([337, 119, 62]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.MERGED_CELLS}"`, () => {
    cy.loadSheetInSV(fileNames.MERGED_CELLS, 0);
    cy.assertColumnWidths([290, 119, 62, 62, 62, 62]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.BORDERS}"`, () => {
    cy.loadSheetInSV(fileNames.BORDERS, 0);
    cy.assertColumnWidths([62, 62, 62]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.OBJECTS}"`, () => {
    cy.loadSheetInSV(fileNames.OBJECTS, 0);
    cy.assertColumnWidths([80, 50, 50]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.CUSTOM_COLOR_PALETTE}"`, () => {
    cy.loadSheetInSV(fileNames.CUSTOM_COLOR_PALETTE, 0);
    cy.assertColumnWidths([393, 108, 147, 147, 62, 62]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TEXT_ALIGNMENT}"`, () => {
    cy.loadSheetInSV(fileNames.TEXT_ALIGNMENT, 0);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TEXT_HORIZONTAL_OVERLAP}"`, () => {
    cy.loadSheetInSV(fileNames.TEXT_HORIZONTAL_OVERLAP, 0);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TEXT_HORIZONTAL_OVERLAP}" - tab 1`, () => {
    cy.loadSheetInSV(fileNames.TEXT_HORIZONTAL_OVERLAP, 1);
    cy.assertColumnWidths([22, 535, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TEXT_HORIZONTAL_OVERLAP}" - tab 2`, () => {
    cy.loadSheetInSV(fileNames.TEXT_HORIZONTAL_OVERLAP, 2);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.LINE_SPACE}"`, () => {
    cy.loadSheetInSV(fileNames.LINE_SPACE, 0);
    cy.assertColumnWidths([194, 326, 63]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.LINE_HEIGHTS_VERTICAL_ALIGNMENT}" - tab 0`, () => {
    cy.loadSheetInSV(fileNames.LINE_HEIGHTS_VERTICAL_ALIGNMENT, 0);
    cy.assertColumnWidths([161, 161, 161]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.LINE_HEIGHTS_VERTICAL_ALIGNMENT}" - tab 1`, () => {
    cy.loadSheetInSV(fileNames.LINE_HEIGHTS_VERTICAL_ALIGNMENT, 1);
    cy.assertColumnWidths([76, 85, 76]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.LINE_HEIGHTS_VERTICAL_ALIGNMENT}" - tab 2`, () => {
    cy.loadSheetInSV(fileNames.LINE_HEIGHTS_VERTICAL_ALIGNMENT, 2);
    cy.assertColumnWidths([161, 161, 161]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.LINE_HEIGHTS_VERTICAL_ALIGNMENT}" - tab 3`, () => {
    cy.loadSheetInSV(fileNames.LINE_HEIGHTS_VERTICAL_ALIGNMENT, 3);
    cy.assertColumnWidths([76, 85, 76]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TAB_NAMES}"`, () => {
    cy.loadSheetInSV(fileNames.TAB_NAMES, 0);
    cy.assertColumnWidths([64, 281]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.EDGE_CASE_CELLS_BACKGROUND}" - tab 0`, () => {
    cy.loadSheetInSV(fileNames.EDGE_CASE_CELLS_BACKGROUND, 0);
    cy.assertColumnWidths([96, 285, 705, 101, 265, 156]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.EDGE_CASE_CELLS_BACKGROUND}" - tab 1`, () => {
    cy.loadSheetInSV(fileNames.EDGE_CASE_CELLS_BACKGROUND, 1);
    cy.assertColumnWidths([96, 285, 705, 107, 265]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.CURRENCY_ACCOUNTING_CUSTOM_FORMAT}" - tab 0`, () => {
    cy.loadSheetInSV(fileNames.CURRENCY_ACCOUNTING_CUSTOM_FORMAT, 0);
    cy.assertColumnWidths([158, 158, 158]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.CURRENCY_ACCOUNTING_CUSTOM_FORMAT}" - tab 1`, () => {
    cy.loadSheetInSV(fileNames.CURRENCY_ACCOUNTING_CUSTOM_FORMAT, 1);
    cy.assertColumnWidths([115, 115, 115]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.CURRENCY_ACCOUNTING_CUSTOM_FORMAT}" - tab 2`, () => {
    cy.loadSheetInSV(fileNames.CURRENCY_ACCOUNTING_CUSTOM_FORMAT, 2);
    cy.assertColumnWidths([133, 131, 127]);
    cy.matchWorkbookSnapshot();
  });
});
