import 'cypress-file-upload';

const DEMO_IFRAME_SELECTOR = '#spreadsheet-viewer iframe';
const DEMO_START_SCREEN_OFF_SELECTOR = '.show';
const DEMO_FILE_INPUT_SELECTOR = '[type=file]';
const SV_TAB_SELECTOR = '.sv-tabs button[role="tab"]';
const SV_FIRST_TAB_SELECTOR = `${SV_TAB_SELECTOR}:first-child`;
const SV_ROOT_SELECTOR = 'div#root';
const SV_HOT_MASTER_SELECTOR = 'div[role=tabpanel] .ht_master';
const SV_ERROR_CODE_SELECTOR = 'div[role=tabpanel] .error-code';
const SV_CONTENT_LOADED_SELECTOR = `${SV_HOT_MASTER_SELECTOR}, ${SV_ERROR_CODE_SELECTOR}`;
const fileLoadingTimeout = 15000;

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
  // see https://github.com/palmerhq/cypress-image-snapshot for configuration of .attachFile()
  const url = '/src/testbed/index.html';
  if (urlParameters && urlParameters.indexOf('?') !== 0) {
    throw new Error('urlParameters must be empty or begin with ?');
  }
  cy.visit(`${url}${urlParameters}`);

  return cy.fixture(fileName, 'binary').then((fileContent) => {
    cy.get(DEMO_FILE_INPUT_SELECTOR).attachFile({
      fileContent, fileName, encoding: 'binary', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    cy.get(`${DEMO_START_SCREEN_OFF_SELECTOR} ${DEMO_IFRAME_SELECTOR}`, { timeout: fileLoadingTimeout }).should('exist');
    cy.firstTabShouldExistInDemo();
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
