it('should load multiple sv instances on the same page', () => {
  cy.visit('/cypress/fixtures/client-library/multi-sv.html');

  const oneSpy = cy.spy().as('one');
  const twoSpy = cy.spy().as('two');

  cy.window().then((window) => {
    window.document.getElementById('one').addEventListener('activeSheetChanged', () => oneSpy());
    window.document.getElementById('two').addEventListener('activeSheetChanged', () => twoSpy());

    const loadSV = (selector, workbook) => {
      window.SpreadsheetViewer({
        assetsUrl: '/index.html',
        container: window.document.querySelector(selector)
      }).then((instance) => {
        instance.loadWorkbook(`/cypress/fixtures/${workbook}`, 0);
      });
    };

    loadSV('#one', 'functions.xlsx');
    loadSV('#two', 'styling.xlsx');
  });

  cy.waitForSvIframeToBeLoaded('#one iframe');
  cy.waitForSvIframeToBeLoaded('#two iframe');

  cy.get('@two').should('have.been.calledOnce');
  cy.get('@one').should('have.been.calledOnce');
  cy.get('@two').should('have.been.calledOnce');

  cy.matchUISnapshot();
});
