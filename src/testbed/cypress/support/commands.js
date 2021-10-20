import 'cypress-file-upload';

import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

const DEMO_IFRAME_SELECTOR = '#spreadsheet-viewer iframe';
const DEMO_START_SCREEN_OFF_SELECTOR = '.show';
const DEMO_FILE_INPUT_SELECTOR = '[type=file]';
const SV_TAB_SELECTOR = '.sv-tabs button[role="tab"]';
const SV_FIRST_TAB_SELECTOR = `${SV_TAB_SELECTOR}:first-child`;
const SV_SELECTED_TAB_SELECTOR = '[aria-selected=true].Mui-selected';
const SV_ROOT_SELECTOR = 'div#root';
const SV_HOT_MASTER_SELECTOR = 'div[role=tabpanel] .ht_master';
const SV_ERROR_CODE_SELECTOR = 'div[role=tabpanel] .error-code';
const SV_CONTENT_LOADED_SELECTOR = `${SV_HOT_MASTER_SELECTOR}, ${SV_ERROR_CODE_SELECTOR}`;
const fileLoadingTimeout = 15000;

addMatchImageSnapshotCommand();

Cypress.Commands.add('getIntoIFrameInDemo', (callback) => {
  return cy
    .get(DEMO_IFRAME_SELECTOR, { log: false })
    .should(iframe => expect(iframe.contents().find(SV_ROOT_SELECTOR)).to.exist, { log: false })
    .then(iframe => cy.wrap(iframe.contents().find(SV_ROOT_SELECTOR).parent(), { log: false }))
    .within({ log: false }, callback);
});

Cypress.Commands.add('getSheetTabInSV', (tabIndex) => {
  const tabNaturalNumber = tabIndex + 1;
  const desiredTabSelector = `${SV_TAB_SELECTOR}:nth-child(${tabNaturalNumber})`;

  return cy.get(desiredTabSelector, { timeout: fileLoadingTimeout });
});

Cypress.Commands.add('firstTabShouldExistInDemo', () => {
  cy.getIntoIFrameInDemo((iframe) => {
    cy.wrap(iframe)
      .getSheetTabInSV(0)
      .should('exist');
  });
});

Cypress.Commands.add('firstTabShouldHaveTextInDemo', (text) => {
  cy.getIntoIFrameInDemo((iframe) => {
    cy.wrap(iframe)
      .get(`${SV_FIRST_TAB_SELECTOR}:contains(${text})`, { timeout: fileLoadingTimeout })
      .get(`${SV_CONTENT_LOADED_SELECTOR}`, { timeout: fileLoadingTimeout }); // wait for Handsontable to be rendered
  });
});

// urlParameters is an optional string, but if it is not empty, it should begin with ?
Cypress.Commands.add('uploadWorkbookInDemo', (fileName, urlParameters = '') => {
  // see https://github.com/palmerhq/cypress-image-snapshot for configuration of .upload()
  const url = '/src/testbed/index.html';
  if (urlParameters && urlParameters.indexOf('?') !== 0) {
    throw new Error('urlParameters must be empty or begin with ?');
  }
  cy.visit(`${url}${urlParameters}`);

  return cy.fixture(fileName, 'base64').then((fileContent) => {
    cy.get(DEMO_FILE_INPUT_SELECTOR).upload({
      fileContent, fileName, encoding: 'binary', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    cy.get(`${DEMO_START_SCREEN_OFF_SELECTOR} ${DEMO_IFRAME_SELECTOR}`, { timeout: fileLoadingTimeout }).should('exist');
    cy.firstTabShouldExistInDemo();
  });
});

Cypress.Commands.add('changeSheetInDemo', (tabIndex) => {
  const tabNaturalNumber = tabIndex + 1;
  const desiredTabSelector = `${SV_TAB_SELECTOR}:nth-child(${tabNaturalNumber})`;
  cy.getIntoIFrameInDemo((iframe) => {
    cy
      .wrap(iframe)
      .getSheetTabInSV(tabIndex)
      .click({ force: true })
      .get(`${desiredTabSelector}${SV_SELECTED_TAB_SELECTOR}`)
      .get(SV_CONTENT_LOADED_SELECTOR); // wait for Handsontable to be rendered
  });
});

// rowNumber, colNumber must be a zero-based number
Cypress.Commands.add('getHandsontableCellInDemo', (iframe, rowIndex, colIndex) => {
  const rowNaturalNumber = rowIndex + 1;
  const colNaturalNumber = colIndex + 1;

  cy.wrap(iframe).get(
    `${SV_HOT_MASTER_SELECTOR} tbody tr:nth-child(${rowNaturalNumber}) td:nth-of-type(${colNaturalNumber})`,
    { timeout: fileLoadingTimeout }
  );
});

const dockerHostNonLinux = 'http://host.docker.internal:1234';
const dockerHostLinux = 'http://172.17.0.1:1234';
const shouldSaveScreenshot = (Cypress.config().baseUrl === dockerHostLinux || Cypress.config().baseUrl === dockerHostNonLinux);
let currentFilePage = '';

// load a workbook at a given sheet index in the demo app, with SV loaded using the JavaScript API
Cypress.Commands.add('loadSheetInDemo', (fileName, tabIndex) => {
  cy.viewport(1920, 1080);
  if (currentFilePage !== fileName) {
    cy.uploadWorkbookInDemo(fileName);
    currentFilePage = fileName;
  }
  cy.changeSheetInDemo(tabIndex);
});

// force full page load
Cypress.Commands.add('resetLoadSheet', () => {
  currentFilePage = '';
});

Cypress.Commands.add('matchSpreadsheetFileTabSnapshot', () => {
  const specName = Cypress.mocha.getRunner().suite.ctx.test.parent.title;
  const testName = Cypress.mocha.getRunner().suite.ctx.test.title.replace('should render ', '');

  if (shouldSaveScreenshot) {
    // see https://docs.cypress.io/api/commands/screenshot.html#Arguments for configuration of screenshot
    cy.matchImageSnapshot(`${specName} - ${testName}`);
  }
});
