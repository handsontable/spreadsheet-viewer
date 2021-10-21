import { FILE_GENERAL } from '../../support/fileNames/xlsx';

const BUTTON_OPEN_FEEDBACK_MODAL = '[data-cy=toolbar-feedback-button]';
const MODAL_FEEDBACK = '[data-cy=modal-feedback]';
const CLOSE_MODAL_ICON = '[data-cy="close-modal"]';

context('Modals', () => {
  beforeEach(() => {
    cy.resetLoadSheet();
  });

  it('should open feedback modal in light theme', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0, 'light');
    cy.get(BUTTON_OPEN_FEEDBACK_MODAL).click();
    cy.get(MODAL_FEEDBACK).should('be.visible');
    cy.matchUISnapshot();
  });

  it('should open feedback modal in dark theme', () => {
    cy.loadSheetInSV(FILE_GENERAL, 0, 'dark');
    cy.get(BUTTON_OPEN_FEEDBACK_MODAL).click();
    cy.get(MODAL_FEEDBACK).should('be.visible');
    cy.matchUISnapshot();
  });

  it('should open feedback modal and close it', () => {
    // open modal
    cy.loadSheetInSV(FILE_GENERAL, 0, 'light', false);
    cy.get(BUTTON_OPEN_FEEDBACK_MODAL).click();
    cy.get(MODAL_FEEDBACK).should('be.visible');

    // close modal
    cy.wait(100); // waiting fixes flaky errors listed in https://github.com/handsontable/spreadsheet-viewer-dev/pull/738#pullrequestreview-499391221
    cy.get(`${MODAL_FEEDBACK} ${CLOSE_MODAL_ICON}`).click();
    cy.get(MODAL_FEEDBACK).should('not.exist');
  });
});
