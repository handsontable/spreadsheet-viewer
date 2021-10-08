import * as fileNames from '../../support/fileNames/xlsx';

context('CSS is rendered correctly', () => {
  it('should preserve correct fonts when switching back to the same sheet', () => {
    cy.loadSheetInSV(fileNames.TEXT_HORIZONTAL_OVERLAP, 0);
    cy.loadSheetInSV(fileNames.TEXT_HORIZONTAL_OVERLAP, 1);
    cy.loadSheetInSV(fileNames.TEXT_HORIZONTAL_OVERLAP, 0);
    cy.matchWorkbookSnapshot();
  });
});
