import { FILE_GENERAL } from '../../support/fileNames/xlsx';

const emptyFilePath = `/cypress/fixtures/${FILE_GENERAL}`;

const SV_BODY_FONTS_LOADED_SELECTOR = 'body[data-webfonts-loaded]';
const SV_HOT_MASTER_SELECTOR = 'div[role=tabpanel] .ht_master';
const SV_ERROR_CODE_SELECTOR = '.error-code';
const SV_CONTENT_LOADED_SELECTOR = `${SV_HOT_MASTER_SELECTOR}, ${SV_ERROR_CODE_SELECTOR}`;
const fileLoadingTimeout = 15000;

context('Sheet number', () => {
  it('Should recover from an invalid sheet number - less than 0', () => {
    cy.visit(`/index.html?workbookUrl=${emptyFilePath}&sheet=-1`);
    cy.get(`${SV_BODY_FONTS_LOADED_SELECTOR} ${SV_CONTENT_LOADED_SELECTOR}`, { timeout: fileLoadingTimeout }); // wait for Handsontable to be rendered
    cy.matchUISnapshot();
  });

  it('Should recover from an invalid sheet number - larger than sheet amount', () => {
    cy.visit(`/index.html?workbookUrl=${emptyFilePath}&sheet=1000`);
    cy.get(`${SV_BODY_FONTS_LOADED_SELECTOR} ${SV_CONTENT_LOADED_SELECTOR}`, { timeout: fileLoadingTimeout }); // wait for Handsontable to be rendered
    cy.matchUISnapshot();
  });

  // TODO after Query String API parameters validation
  it.skip('Should throw an error if the sheet number isn\'t a number', () => {
    cy.visit(`/index.html?workbookUrl=${emptyFilePath}&sheet=hmmm`);
  });
});
