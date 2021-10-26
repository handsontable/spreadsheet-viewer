import * as fileNames from '../../support/fileNames/xlsx';

const SV_HOT_MASTER_SELECTOR = 'div[role=tabpanel] .ht_master';

const emptyFilePath = `/cypress/fixtures/${fileNames.FILE_GENERAL}`;
const brokenFilePath = `/cypress/fixtures/${fileNames.BROKEN}`;
const unsupportedFiletypePath = '/cypress/fixtures/unsupported.txt';

const disguisedXlsxFilePath = '/cypress/fixtures/disguised-xlsx.ods';
const disguisedBrokenFilePath = '/cypress/fixtures/disguised-broken.ods';

context('File extension', () => {
  it('should load an .xltx file without the `moreformats` flag', () => {
    cy.loadSheetInSV('empty.xltx', 0);
    cy.get(SV_HOT_MASTER_SELECTOR);
    cy.matchUISnapshot();
  });

  it('should ignore file extension case sensitivity - url', () => {
    cy.loadSheetInSV(fileNames.FILE_EMPTY_EXTENSION_CASING, 0);
    cy.get(SV_HOT_MASTER_SELECTOR);
    cy.matchUISnapshot();
  });

  it('should ignore file extension case sensitivity - upload', () => {
    cy.loadSheetInSV(fileNames.FILE_GENERAL, 0);

    cy.get('[data-cy=toolbar-upload-button]').click()
      .get('[data-cy=toolbar-upload-input]').attachFile({
        filePath: fileNames.STYLING,
        fileName: 'styling.xLsx'
      });

    cy.get('[data-cy=tabbar-workbook-tab]').should('contain', 'Styling');
  });
});

const success = () => cy.get(SV_HOT_MASTER_SELECTOR);
const error = code => cy.matchErrorCode(code);

const PARSER_ERROR = 'PARSER_ERROR';
const UNSUPPORTED_WORKBOOK_FORMAT_ERROR = 'UNSUPPORTED_WORKBOOK_FORMAT_ERROR';
const UNSUPPORTED_FILE_FORMAT_ERROR = 'UNSUPPORTED_FILE_FORMAT_ERROR';

// Below is an implementation of the matrix at the end of
// https://github.com/handsontable/spreadsheet-viewer-dev/issues/752#issuecomment-713649222
context('Filetype', () => {
  it('`supported workbook`, `moreformats` false, `js-xlsx` valid', () => {
    cy.visit(`/index.html#workbookUrl=${emptyFilePath}`);
    success();
    cy.matchUISnapshot();
  });
  it('`supported workbook`, `moreformats` true, `js-xlsx` valid', () => {
    cy.visit(`/index.html#workbookUrl=${emptyFilePath}&flags=moreformats`);
    success();
    cy.matchUISnapshot();
  });
  it('`supported workbook`, `moreformats` false, `js-xlsx` invalid', () => {
    cy.visit(`/index.html#workbookUrl=${brokenFilePath}`);
    error(PARSER_ERROR);
    cy.matchUISnapshot();
  });
  it('`supported workbook`, `moreformats` true, `js-xlsx` invalid', () => {
    cy.visit(`/index.html#workbookUrl=${brokenFilePath}&flags=moreformats`);
    error(PARSER_ERROR);
    cy.matchUISnapshot();
  });

  it('`unsupported workbook`, `moreformats` false, `js-xlsx` valid', () => {
    cy.visit(`/index.html#workbookUrl=${disguisedXlsxFilePath}`);
    error(UNSUPPORTED_WORKBOOK_FORMAT_ERROR);
    cy.matchUISnapshot();
  });
  it('`unsupported workbook`, `moreformats` true, `js-xlsx` valid', () => {
    cy.visit(`/index.html#workbookUrl=${disguisedXlsxFilePath}&flags=moreformats`);
    success();
    cy.matchUISnapshot();
  });
  it('`unsupported workbook`, `moreformats` false, `js-xlsx` invalid', () => {
    cy.visit(`/index.html#workbookUrl=${disguisedBrokenFilePath}`);
    error(UNSUPPORTED_WORKBOOK_FORMAT_ERROR);
    cy.matchUISnapshot();
  });
  it('`unsupported workbook`, `moreformats` true, `js-xlsx` invalid', () => {
    cy.visit(`/index.html#workbookUrl=${disguisedBrokenFilePath}&flags=moreformats`);
    error(PARSER_ERROR);
    cy.matchUISnapshot();
  });

  it('`unsupported file type`, `moreformats` false, `js-xlsx` valid', () => {
    cy.visit(`/index.html#workbookUrl=${unsupportedFiletypePath}`);
    error(UNSUPPORTED_FILE_FORMAT_ERROR);
    cy.matchUISnapshot();
  });
  it('`unsupported file type`, `moreformats` true, `js-xlsx` valid', () => {
    cy.visit(`/index.html#workbookUrl=${unsupportedFiletypePath}&flags=moreformats`);
    error(UNSUPPORTED_FILE_FORMAT_ERROR);
    cy.matchUISnapshot();
  });
  it('`unsupported file type`, `moreformats` false, `js-xlsx` invalid', () => {
    cy.visit(`/index.html#workbookUrl=${unsupportedFiletypePath}`);
    error(UNSUPPORTED_FILE_FORMAT_ERROR);
    cy.matchUISnapshot();
  });
  it('`unsupported file type`, `moreformats` true, `js-xlsx` invalid', () => {
    cy.visit(`/index.html#workbookUrl=${unsupportedFiletypePath}&flags=moreformats`);
    error(UNSUPPORTED_FILE_FORMAT_ERROR);
    cy.matchUISnapshot();
  });
});

context('mime type check', () => {
  it('mimetype: `supported workbook`', () => {
    cy.visit(`/index.html#workbookUrl=${emptyFilePath}`);
    success();
    cy.matchUISnapshot();
  });

  it('mimetype: `unsupported workbook`', () => {
    cy.visit('/index.html#workbookUrl=/simulate/mime-ods');
    error(UNSUPPORTED_WORKBOOK_FORMAT_ERROR);
    cy.matchUISnapshot();
  });

  it('mimetype: `unsupported file type`', () => {
    cy.visit('/index.html#workbookUrl=/simulate/mime-wrong');
    error(UNSUPPORTED_FILE_FORMAT_ERROR);
    cy.matchUISnapshot();
  });
});
