import {
  FILE_GENERAL,
  STYLING,
  FILE_WITH_VERY_LONG_NAME,
  MANY_TABS,
  OBJECTS_CHARTS_AND_FROZEN
} from '../../support/fileNames/xlsx';

const MOBILE_MENU = '[data-cy=mobile-menu-icon]';
const DROP_UP_MENU_BUTTON = '[data-cy="dropup-menu-button"]';

context('Mobile', () => {
  afterEach(() => {
    cy.resetLoadSheet();
  });

  it('should render app in dark theme', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0, 'dark', true, [], true);
    cy.matchUISnapshot();
  });

  it('should render app in light theme', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0, 'light', true, [], true);
    cy.matchUISnapshot();
  });

  it('should upload a file', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0, 'dark', true, [], true);
    cy.get(MOBILE_MENU).click()
      .get('[data-cy=toolbar-upload-button-mobile]').click()
      .get('[data-cy=toolbar-upload-input-mobile]').attachFile(STYLING)
      .get('[data-cy=tabbar-workbook-tab]').should('contain', 'Styling');
  });

  it('should download a file', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0, 'dark', true, [], true);
    cy.get(MOBILE_MENU).click()
      .get('[data-cy=download-anchor-mobile]')
      .should(($anchor) => {
        expect($anchor[0]).to.have.attr('download', FILE_GENERAL);
        expect($anchor[0].href).to.match(/^data:|http:|https:/);
      });
  });

  it('should open the feedback modal button from feedback button', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0, 'dark', true, [], true);
    cy.get(MOBILE_MENU).click()
      .get('[data-cy=toolbar-feedback-button-mobile]').click()
      .get('[data-cy=modal-feedback]');
    cy.matchUISnapshot();
  });

  it('should open file with very long name', () => {
    cy.loadSheetInSV(FILE_WITH_VERY_LONG_NAME, 0, 'dark', true, [], true);
    cy.matchUISnapshot();
  });

  it('should open the tabbar dropup menu in light theme', () => {
    cy.loadSheetInSV(MANY_TABS, 0, 'light', true, [], true);
    cy.get(DROP_UP_MENU_BUTTON).click();
    cy.matchUISnapshot();
  });

  it('should open the tabbar dropup menu in dark theme', () => {
    cy.loadSheetInSV(MANY_TABS, 0, 'dark', true, [], true);
    cy.get(DROP_UP_MENU_BUTTON).click();
    cy.matchUISnapshot();
  });

  it('should not have the frozen line', () => { // because frozen panes are disabled on mobile
    cy.loadSheetInSV(OBJECTS_CHARTS_AND_FROZEN, 6, 'dark', true, [], true);
    cy.matchUISnapshot();
  });
});
