import * as fileNames from '../../support/fileNames/xlsx';

context('Floating box with merged cells', () => {
  it(`should render ${fileNames.FLOATING_BOX_AND_MERGED_CELLS}`, () => {
    cy.loadSheetInSV(fileNames.FLOATING_BOX_AND_MERGED_CELLS, 0);
    cy.matchWorkbookSnapshot();
  });
});
