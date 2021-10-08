import { FILE_GENERAL, STYLING } from '../../support/fileNames/xlsx';

context('Toolbar', () => {
  beforeEach(() => {
    cy.loadSheetInSV(FILE_GENERAL, 0);
  });

  afterEach(() => {
    cy.resetLoadSheet();
  });

  it('should upload a file', () => {
    cy.get('[data-cy=toolbar-upload-button]').click()
      .get('[data-cy=toolbar-upload-input]').attachFile(STYLING)
      .get('[data-cy=tabbar-workbook-tab]').should('contain', 'Styling');
  });

  it('should download a file', () => {
    cy.get('[data-cy=download-anchor]')
      .should(($anchor) => {
        expect($anchor[0]).to.have.attr('download', FILE_GENERAL);
        expect($anchor[0].href).to.match(/^data:|http:|https:/);
      });
  });

  it('should open the feedback modal button from feedback button', () => {
    cy.get('[data-cy=toolbar-feedback-button]').click()
      .get('[data-cy=modal-feedback]');
  });
});

context('Toolbar with fileName', () => {
  it('should download a file with custom fileName', () => {
    const filePath = `/cypress/fixtures/${FILE_GENERAL}`;
    const fileName = 'test.xlsx';
    cy.visit(`/index.html?workbookUrl=${filePath}&fileName=${fileName}`);
    cy.get('[data-cy=download-anchor]')
      .should(($anchor) => {
        expect($anchor[0]).to.have.attr('download', fileName);
        expect($anchor[0].href).to.match(/^data:|http:|https:/);
      });
  });
});

context('Toolbar in crash screen', () => {
  it('should upload a new file', () => {
    cy.visit('/index.html?workbookUrl=wrongFileUrl');

    cy.get('[data-cy=toolbar-upload-button]').click()
      .get('[data-cy=toolbar-upload-input]').attachFile(STYLING)
      .get('[data-cy=tabbar-workbook-tab]').should('contain', 'Styling');
  });

  it('should open the feedback modal button from feedback button', () => {
    cy.get('[data-cy=toolbar-feedback-button]').click()
      .get('[data-cy=modal-feedback]');
  });
});
