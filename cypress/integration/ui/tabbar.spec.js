import { MANY_TABS, SHEETS_ORDER } from '../../support/fileNames/xlsx';

const ACTIVE_TAB = '[data-cy=tabbar-workbook-tab][aria-selected="true"]';
const DROP_UP_MENU_BUTTON = '[data-cy="dropup-menu-button"]';
const CELL_WITH_TEXT = '.sv-cell-text-wrapper';

context('Tabbar', () => {
  afterEach(() => {
    cy.resetLoadSheet();
  });

  it('should open the tabbar dropup menu in light theme', () => {
    cy.loadSheetInSV(MANY_TABS, 0, 'light');
    cy.get(DROP_UP_MENU_BUTTON).click();
    cy.matchUISnapshot();
  });

  it('should open the tabbar dropup menu in dark theme', () => {
    cy.loadSheetInSV(MANY_TABS, 0, 'dark');
    cy.get(DROP_UP_MENU_BUTTON).click();
    cy.matchUISnapshot();
  });

  it('should select tabs using the dropup menu', () => {
    cy.loadSheetInSV(MANY_TABS, 0);

    cy.get(DROP_UP_MENU_BUTTON).click();
    // select 3rd tab
    cy.get('[data-cy="dropup-menu-item-2"]').click({ force: true });
    cy.get(ACTIVE_TAB).should('contain', 'Sheet3');
    // select 1st tab
    cy.get('[data-cy="dropup-menu-item-0"]').click({ force: true });
    cy.get(ACTIVE_TAB).should('contain', 'Sheet1');
    // scroll to the bottom of the dropup menu
    cy.get('.sv-dropup-menu-container').should('be.visible').scrollTo('bottom');
    // select last (11th) tab
    cy.get('[data-cy="dropup-menu-item-10"]').click({ force: true });
    cy.get(ACTIVE_TAB).should('contain', 'Sheet11');
  });

  it('should select tabs using tabbar tabs', () => {
    cy.loadSheetInSV(MANY_TABS, 0);

    // select 4th tab
    cy.contains('Sheet4').click();
    cy.get(ACTIVE_TAB).should('contain', 'Sheet4');
    cy.get(CELL_WITH_TEXT).should('contain', 'sheet4');

    // select 2th tab
    cy.contains('Sheet2').click();
    cy.get(ACTIVE_TAB).should('contain', 'Sheet2');
    cy.get(CELL_WITH_TEXT).should('contain', 'sheet2');
  });

  it('should select last tab and first tab using tabbar\'s carets', () => {
    cy.loadSheetInSV(MANY_TABS, 0);

    // select and click the last tab
    cy.get('[data-cy="tabbar-right-caret"]').click();
    cy.contains('Sheet22').should('be.visible').click();

    // assert last tab is clicked
    cy.get(ACTIVE_TAB).should('contain', 'Sheet22');
    cy.get(CELL_WITH_TEXT).should('contain', 'sheet22');

    // select first tab
    cy.contains('Sheet1').should('not.be.visible');
    cy.get('[data-cy="tabbar-left-caret"]').click();
    cy.contains('Sheet1').should('be.visible').click();
  });

  it('should switch tabs and render sheets correctly', () => {
    cy.loadSheetInSV(SHEETS_ORDER, 0);
    cy.get('[data-cy=tabbar-workbook-tab]:nth-child(2)').click();
    cy.contains('Second sheet');
    cy.get('[data-cy=tabbar-workbook-tab]:nth-child(3)').click();
    cy.contains('Third sheet');
    cy.get('[data-cy=tabbar-workbook-tab]:nth-child(4)').click();
    cy.contains('Fourth sheet');
    cy.get('[data-cy=tabbar-workbook-tab]:nth-child(5)').click();
    cy.contains('Fifth sheet');
  });
});
