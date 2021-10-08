import { FILE_GENERAL } from '../../support/fileNames/xlsx';

context('UI: Default view', () => {
  beforeEach(() => {
    cy.resetLoadSheet();
  });

  it('should render toolbar and tabbar in light theme', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0, 'light');
    cy.matchUISnapshot();
  });

  it('should render toolbar and tabbar in dark theme', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0, 'dark');
    cy.matchUISnapshot();
  });
});
