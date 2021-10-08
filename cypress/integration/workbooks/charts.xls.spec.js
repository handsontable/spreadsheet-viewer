import * as fileNames from '../../support/fileNames/xls';
import { FEATURE_CHARTS, FEATURE_MORE_FORMATS } from '../../support/features';

context(fileNames.CHARTS, () => {
  it('should render tab 0', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 0, 'dark', true, [FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([87, 87, 87]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 1', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 1, 'dark', true, [FEATURE_CHARTS, FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 2', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 2, 'dark', true, [FEATURE_CHARTS, FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 3', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 3, 'dark', true, [FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 4', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 4, 'dark', true, [FEATURE_CHARTS, FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 5', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 5, 'dark', true, [FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 6', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 6, 'dark', true, [FEATURE_CHARTS, FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 7', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 7, 'dark', true, [FEATURE_CHARTS, FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 8', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 8, 'dark', true, [FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 9', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 9, 'dark', true, [FEATURE_CHARTS, FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 10', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 10, 'dark', true, [FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 11', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 11, 'dark', true, [FEATURE_MORE_FORMATS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });
});
