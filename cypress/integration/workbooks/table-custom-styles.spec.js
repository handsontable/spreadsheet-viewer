import * as fileNames from '../../support/fileNames/xlsx';

context('Custom styles with Table', () => {

  it(`should render "${fileNames.TABLE_BORDER}" - tab 0`, () => {
    cy.loadSheetInSV(fileNames.TABLE_BORDER, 0);
    cy.assertColumnWidths([88, 104, 88]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TABLE_BORDER}" - tab 1`, () => {
    cy.loadSheetInSV(fileNames.TABLE_BORDER, 1);
    cy.assertColumnWidths([88, 104, 87]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TABLE_BORDER}" - tab 2`, () => {
    cy.loadSheetInSV(fileNames.TABLE_BORDER, 2);
    cy.assertColumnWidths([88, 104, 88]);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.TABLE_BORDER}" - tab 3`, () => {
    cy.loadSheetInSV(fileNames.TABLE_BORDER, 3);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  // TODO loading this sheet causes timeout
  xit(`should render "${fileNames.SAMPLE_FILE}" - tab 0`, () => {
    cy.loadSheetInSV(fileNames.SAMPLE_FILE, 0);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.SAMPLE_FILE}" - tab 1`, () => {
    cy.loadSheetInSV(fileNames.SAMPLE_FILE, 1);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.SAMPLE_FILE}" - tab 2`, () => {
    cy.loadSheetInSV(fileNames.SAMPLE_FILE, 2);
    cy.matchWorkbookSnapshot();
  });

  it(`should render "${fileNames.SAMPLE_FILE}" - tab 3`, () => {
    cy.loadSheetInSV(fileNames.SAMPLE_FILE, 3);
    cy.matchWorkbookSnapshot();
  });

});
