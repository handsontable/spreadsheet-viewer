import * as fileNames from '../../support/fileNames/xlsx';

context(fileNames.EMBEDS, () => {
  it('should render tab 0 (gif)', () => {
    cy.loadSheetInSV(fileNames.EMBEDS, 0);
    cy.assertColumnWidths([85, 85, 85]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 1 (svg)', () => {
    cy.loadSheetInSV(fileNames.EMBEDS, 1);
    cy.assertColumnWidths([85, 85, 85]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 2 (jpeg)', () => {
    cy.loadSheetInSV(fileNames.EMBEDS, 2);
    cy.assertColumnWidths([85, 85, 85]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 3 (twice embedded png)', () => {
    cy.loadSheetInSV(fileNames.EMBEDS, 3);
    cy.assertColumnWidths([85, 85, 85]);
    cy.matchWorkbookSnapshot();
  });

});
