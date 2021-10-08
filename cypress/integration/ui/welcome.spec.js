context('Welcome screen', () => {
  it('should show developer welcome screen', () => {
    cy.visit('/index.html');
    // The welcome screen is shown only after 1000ms of no workbook input being present, therefore a wait is needed.
    cy.wait(2000);
    cy.matchUISnapshot();
  });
});
