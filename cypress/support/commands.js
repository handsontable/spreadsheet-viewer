import 'cypress-file-upload';

import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

import { FEATURE_FULL_PAGE, FEATURE_CHARTS } from './features';

const SV_TAB_SELECTOR = '.sv-tabs button[role="tab"]';
const SV_SELECTED_TAB_SELECTOR = '[aria-selected=true].Mui-selected';
const SV_BODY_LOADED_SELECTOR = 'body[data-webfonts-loaded][data-embeds-loaded]';
const SV_HOT_MASTER_SELECTOR = 'div[role=tabpanel] .ht_master';
const SV_SCROLL_CONTAINER_SELECTOR = `${SV_HOT_MASTER_SELECTOR} .wtHolder`;
const SV_COL_SELECTOR = `${SV_HOT_MASTER_SELECTOR} colgroup col:not(:nth-child(1))`; // skip first <col>, because it defines the width of the header column
const SV_ERROR_CODE_SELECTOR = '.error-code';
const SV_CONTENT_LOADED_SELECTOR = `${SV_HOT_MASTER_SELECTOR}, ${SV_ERROR_CODE_SELECTOR}`;
const fileLoadingTimeout = 15000;
const LICENSE_KEY = 'demo';
const EXCEL_EXTENSIONS = ['xls', 'xlsx'];

addMatchImageSnapshotCommand();

Cypress.Commands.add('getSheetTabInSV', (tabIndex) => {
  const tabNaturalNumber = tabIndex + 1;
  const desiredTabSelector = `${SV_TAB_SELECTOR}:nth-child(${tabNaturalNumber})`;

  return cy.get(desiredTabSelector, { timeout: fileLoadingTimeout });
});

Cypress.Commands.add('changeSheetInSV', (tabIndex) => {
  const tabNaturalNumber = tabIndex + 1;
  const desiredTabSelector = `${SV_BODY_LOADED_SELECTOR} ${SV_TAB_SELECTOR}:nth-child(${tabNaturalNumber})`;
  cy.getSheetTabInSV(tabIndex)
    .click({ force: true })
    // This delay was necessary after the changes in
    // https://github.com/handsontable/spreadsheet-viewer-dev/pull/654
    .wait(500)
    .get(`${desiredTabSelector}${SV_SELECTED_TAB_SELECTOR}`)
    .get(SV_CONTENT_LOADED_SELECTOR); // wait for Handsontable to be rendered
});

Cypress.Commands.add('assertColumnWidths', (widths) => {
  widths.forEach((width, index) => {
    cy.get(`${SV_COL_SELECTOR}:eq(${index})`)
      .should('have.attr', 'style', `width: ${width}px;`);
  });
});

const dockerHostNonLinux = 'http://host.docker.internal:5000';
const dockerHostLinux = 'http://172.17.0.1:5000';
const shouldSaveScreenshot = (Cypress.config().baseUrl === dockerHostLinux || Cypress.config().baseUrl === dockerHostNonLinux);
let currentFilePage = '';

// force full page load
Cypress.Commands.add('resetLoadSheet', () => {
  currentFilePage = '';
});

// load a workbook at a given sheet index in the SV, directly in the main window using Query String API.
Cypress.Commands.add('loadSheetInSV', (fileName, tabIndex, themeStylesheet = 'dark', isLicenseKey = true, flags = [], isMobile = false) => {
  cy.viewport(isMobile ? 'iphone-x' : 1920, 1080);
  const shouldSvBeInFullPageMode = Cypress.mocha.getRunner().suite.parent.file.includes('/workbooks/');
  const mobileConfig = isMobile
    ? {
      onBeforeLoad: (win) => {
        Object.defineProperty(win.navigator, 'userAgent', {
          value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        });
      }
    }
    : {};

  const flagsParameter = flags.concat(shouldSvBeInFullPageMode ? FEATURE_FULL_PAGE : undefined).join(',');
  const request = '/index.html'
    + `?licenseKey=${isLicenseKey ? LICENSE_KEY : ''}`
    + `&workbookUrl=/cypress/fixtures/${fileName}`
    + `&sheet=${tabIndex}`
    + `&themeStylesheet=${themeStylesheet}`
    + `&flags=${flagsParameter}`;

  cy.visit(request, mobileConfig);
  cy.get(`${SV_BODY_LOADED_SELECTOR} ${!shouldSvBeInFullPageMode ? SV_TAB_SELECTOR : ''}`, { timeout: fileLoadingTimeout });
  cy.get(`${SV_BODY_LOADED_SELECTOR} ${SV_CONTENT_LOADED_SELECTOR}`, { timeout: fileLoadingTimeout }); // wait for Handsontable to be rendered
  if (flags.includes(FEATURE_CHARTS)) {
    // sometimes charts on the first tab doesn't render. Need to wait for them longer. This shouldn't be removed
    cy.wait(1000);
  }
});

Cypress.Commands.add('matchErrorCode', (errorCode) => {
  cy.get(SV_ERROR_CODE_SELECTOR, { timeout: 120000 }).should('contain.text', errorCode);
});

const getTestName = () => {
  const cyContextName = Cypress.mocha.getRunner().suite.ctx.test.parent.title;
  const cyItName = Cypress.mocha.getRunner().suite.ctx.test.title.replace('should render ', '');
  const correctSnapshotName = cyItName.split('/').length > 1 ? cyItName.split('/')[1] : cyItName.split('/')[0];
  const isContextNameIncludesExcelExt = cyContextName.split('.').some(name => EXCEL_EXTENSIONS.some(ext => ext === name));

  return isContextNameIncludesExcelExt ? `${cyContextName} - ${correctSnapshotName}` : correctSnapshotName;
};

const screenshotOptions = {
  capture: 'fullPage'
};

Cypress.Commands.add('matchWorkbookSnapshot', (tabNumber) => {
  const tabName = tabNumber === undefined ? '' : ` - tab ${tabNumber}`;
  if (shouldSaveScreenshot) {
    // see https://docs.cypress.io/api/commands/screenshot.html#Arguments for configuration of screenshot
    cy.get('.ht_master .wtHider table')
      .matchImageSnapshot(getTestName() + tabName, screenshotOptions);
  }
});

Cypress.Commands.add('matchUISnapshot', () => {
  if (shouldSaveScreenshot) {
    // see https://docs.cypress.io/api/commands/screenshot.html#Arguments for configuration of screenshot
    cy.matchImageSnapshot(getTestName());
  }
});

// position can be: topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight
// @see https://docs.cypress.io/api/commands/scrollto.html
Cypress.Commands.add('goToWorksheetPosition', (positionOrX, y = undefined) => {
  cy.get(SV_SCROLL_CONTAINER_SELECTOR).scrollTo(positionOrX, y);
});

Cypress.Commands.add('selectAllCells', (cellNumber) => {
  const isCellNumberProvided = typeof cellNumber === 'number';

  cy
    .get(
      `${SV_HOT_MASTER_SELECTOR} tbody tr td:visible`,
      { timeout: fileLoadingTimeout }
    )
    .then(($tds) => {
      cy
        .wrap($tds[isCellNumberProvided ? cellNumber : 0])
        .type('{ctrl}', { release: false })
        .type('a', { release: false });
    });
});

Cypress.Commands.add('makeSnapshotsForWholeFile', (fileName, flags = []) => {
  let tabsCount;

  cy
    .then(() => {
      cy.loadSheetInSV(fileName, 0, 'dark', true, flags);
      cy.matchWorkbookSnapshot(0);
    })
    .get('body')
    .then(($body) => {
      tabsCount = parseInt($body[0].getAttribute('data-sheet-count'), 10);
    })
    .then(() => {
      /* eslint-disable no-loop-func */
      // start from 1 because file is currently loaded on the tab 0, so next tab is at index 1
      for (let workbook = 1; workbook < tabsCount; workbook++) {
        cy.then(() => {
          cy.loadSheetInSV(fileName, workbook, 'dark', true, flags);
          cy.matchWorkbookSnapshot(workbook);
        });
      }
    });
});

Cypress.Commands.add('waitForSvIframeToBeLoaded', (iframeSelector) => {
  return cy.get(iframeSelector).its('0.contentDocument.body').should('not.be.empty').then(cy.wrap).find(SV_HOT_MASTER_SELECTOR);
});
