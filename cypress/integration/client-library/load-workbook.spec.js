it('should respect the sheet parameter', () => {
  cy.visit('/cypress/fixtures/client-library/basic.html');

  cy.window().then((window) => {
    window.SpreadsheetViewer({
      assetsUrl: '/index.html',
      container: window.document.getElementById('sv-root')
    }).then((instance) => {
      instance.loadWorkbook('/cypress/fixtures/empty-3-sheets.xlsx', 1);
    });
  });

  cy.waitForSvIframeToBeLoaded('iframe.spreadsheet-viewer-iframe');

  cy.matchUISnapshot();
});
