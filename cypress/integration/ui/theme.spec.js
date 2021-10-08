import { FILE_GENERAL } from '../../support/fileNames/xlsx';

context('Theme', () => {
  beforeEach(() => {
    cy.resetLoadSheet();
  });

  it('should initialize in the dark theme when requested by Query String API', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0, 'dark');
    cy.get('.sv-app-container').should('have.css', 'background-color', 'rgb(55, 55, 55)');
    cy.matchUISnapshot();
  });

  it('should initialize in the light theme when requested by Query String API', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0, 'light');
    cy.get('.sv-app-container').should('have.css', 'background-color', 'rgb(245, 245, 245)');
    cy.matchUISnapshot();
  });

  it('should initialize in the dark theme by default', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0);
    cy.get('.sv-app-container').should('have.css', 'background-color', 'rgb(55, 55, 55)');
    cy.matchUISnapshot();
  });
});
