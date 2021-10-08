import * as fileNames from '../../support/fileNames/xlsx';

context('Sheets order with number-like sheet names', () => {
  it(`should render ${fileNames.SHEETS_ORDER} - tab 1`, () => {
    cy.loadSheetInSV(fileNames.SHEETS_ORDER, 0);
    cy.matchWorkbookSnapshot();
  });
});
