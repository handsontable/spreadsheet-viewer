import { FILE_GENERAL } from '../../support/fileNames/xlsx';

// Errors that can be simulated with the `simulateError` query parameter
const REACT_INITIALIZATION_ERROR = 'REACT_INITIALIZATION_ERROR';
const INTERPRETER_ERROR = 'INTERPRETER_ERROR';
const RENDER_ERROR = 'RENDER_ERROR';

const emptyFilePath = `/cypress/fixtures/${FILE_GENERAL}`;

context('Errors', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('This is a simulation of an error') || err.message.includes(REACT_INITIALIZATION_ERROR)) {
        return false;
      }
    });
  });

  // If an error is thrown in Handsontable renderer, it should be caught and displayed as RENDER_ERROR
  it('RENDER_ERROR - crash screen with download button', () => {
    const simulateError = RENDER_ERROR;
    cy.visit(`/index.html?workbookUrl=${emptyFilePath}&simulateError=${simulateError}`);
    cy.matchErrorCode('RENDER_ERROR');
    cy.get('.crash-screen--wrapper .sv-button')
      .should(($anchor) => {
        expect($anchor[0]).to.have.attr('download', FILE_GENERAL);
        expect($anchor[0].href).to.match(/^data:|http:|https:/);
      });
    cy.matchUISnapshot();
  });

  it('RENDER_ERROR - crash screen with download button and custom fileName', () => {
    const simulateError = RENDER_ERROR;
    const fileName = 'test.xlsx';
    cy.visit(`/index.html?workbookUrl=${emptyFilePath}&simulateError=${simulateError}&fileName=${fileName}`);
    cy.matchErrorCode('RENDER_ERROR');
    cy.get('.crash-screen--wrapper .sv-button')
      .should(($anchor) => {
        expect($anchor[0]).to.have.attr('download', fileName);
        expect($anchor[0].href).to.match(/^data:|http:|https:/);
      });
    cy.matchUISnapshot();
  });

  it('RENDER_ERROR - crash screen with download button and custom fileName over width limit', () => {
    const simulateError = RENDER_ERROR;
    const fileName = 'tooLongFileNameShouldWrapLineButDoNotChangeMaxWidthQwertyuiopasdfghjklzxccvbnm.xlsx';
    cy.visit(`/index.html?workbookUrl=${emptyFilePath}&simulateError=${simulateError}&fileName=${fileName}`);
    cy.matchErrorCode('RENDER_ERROR');
    cy.get('.crash-screen--wrapper .sv-button')
      .should(($anchor) => {
        expect($anchor[0]).to.have.attr('download', fileName);
        expect($anchor[0].href).to.match(/^data:|http:|https:/);
      });
    cy.matchUISnapshot();
  });

  it('FILE_LOADING_TIMEOUT_ERROR', () => {
    cy.visit('/index.html?workbookUrl=/simulate/timeout');
    cy.matchErrorCode('FILE_LOADING_TIMEOUT_ERROR');
    cy.matchUISnapshot();
  });

  it('FILE_LOADING_STATUS_ERROR', () => {
    cy.visit('/index.html?workbookUrl=/simulate/404');
    cy.matchErrorCode('FILE_LOADING_STATUS_ERROR');
    cy.matchUISnapshot();
  });

  xit('FILE_LOADING_NETWORK_ERROR', () => {
    cy.visit('/index.html?workbookUrl=http://localhost:5001');
    cy.matchErrorCode('FILE_LOADING_NETWORK_ERROR');
    cy.matchUISnapshot();
  });

  it('FILE_SIZE_ERROR - with Content-Length header', () => {
    // Note that this test doesn't actually check if the Content-Length is
    // over the limit, because it seems like we can't read Content-Length
    // inside of Cypress. This is likely because the proxy that they use
    // (which allows for stubbing requests) doesn't seem to ever be
    // forwarding this header to the browser.
    cy.visit('/index.html?workbookUrl=/simulate/file-size/with-content-length');
    cy.matchErrorCode('FILE_SIZE_ERROR');
    cy.matchUISnapshot();
  });

  it('FILE_SIZE_ERROR - no Content-Length header', () => {
    cy.visit('/index.html?workbookUrl=/simulate/file-size/no-content-length');
    cy.matchErrorCode('FILE_SIZE_ERROR');
    cy.matchUISnapshot();
  });

  it('PARSER_ERROR', () => {
    cy.visit('/index.html?workbookUrl=/cypress/fixtures/broken.xlsx');
    cy.matchErrorCode('PARSER_ERROR');
    cy.matchUISnapshot();
  });

  it('INVALID_REQUEST_MESSAGE_ERROR', () => {
    cy.visit('/index.html');
    cy.window().then(($window) => {
      $window.postMessage({
        name: 'loadWorkbook',
        workbook: 100
      });
    });

    cy.matchErrorCode('INVALID_REQUEST_MESSAGE_ERROR');
    cy.matchUISnapshot();
  });

  it('SHEET_LIMIT_ERROR - .xls', () => {
    cy.visit('/index.html?workbookUrl=/cypress/fixtures/101-sheets.xls&flags=moreformats');
    cy.matchErrorCode('SHEET_LIMIT_ERROR');
    cy.matchUISnapshot();
  });

  it('SHEET_LIMIT_ERROR - .xlsx', () => {
    cy.visit('/index.html?workbookUrl=/cypress/fixtures/101-sheets.xlsx');
    cy.matchErrorCode('SHEET_LIMIT_ERROR');
    cy.matchUISnapshot();
  });

  it('INTERPRETER_ERROR', () => {
    cy.visit(`/index.html?workbookUrl=/cypress/fixtures/empty.xlsx&simulateError=${INTERPRETER_ERROR}`);
    cy.matchErrorCode('INTERPRETER_ERROR');
    cy.matchUISnapshot();
  });

  it('INVALID_QUERY_STRING_API_PARAMETER_ERROR', () => {
    cy.visit('/index.html?workbookUrl=/cypress/fixtures/empty.xlsx&sheet=second');
    cy.matchErrorCode('INVALID_QUERY_STRING_API_PARAMETER_ERROR');
    cy.matchUISnapshot();
  });

  it('REACT_INITIALIZATION_ERROR - light theme', () => {
    const simulateError = REACT_INITIALIZATION_ERROR;
    cy.visit(`/index.html?workbookUrl=${emptyFilePath}&themeStylesheet=light&simulateError=${simulateError}`);
    cy.matchErrorCode('UNKNOWN_ERROR');
    cy.matchUISnapshot();
  });

  it('FILE_PROTECTION_ERROR - xlsx', () => {
    cy.visit('/index.html?workbookUrl=/cypress/fixtures/password-hot.xlsx');
    cy.matchErrorCode('FILE_PROTECTION_ERROR');
    cy.matchUISnapshot();
  });

  it('FILE_PROTECTION_ERROR - xls', () => {
    cy.visit('/index.html?workbookUrl=/cypress/fixtures/password-hot.xls&flags=moreformats');
    cy.matchErrorCode('FILE_PROTECTION_ERROR');
    cy.matchUISnapshot();
  });

  it('REACT_INITIALIZATION_ERROR - dark theme', () => {
    const simulateError = REACT_INITIALIZATION_ERROR;
    cy.visit(`/index.html?workbookUrl=${emptyFilePath}&themeStylesheet=dark&simulateError=${simulateError}`);
    cy.matchErrorCode('UNKNOWN_ERROR');
    cy.matchUISnapshot();
  });
});
