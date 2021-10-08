import * as fileNames from '../../support/fileNames/xlsx';
import { FEATURE_CHARTS } from '../../support/features';

context('Feature Flags', () => {
  it('Charts displaying turns off', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 1, 'light', true, /* flags */ []);
    cy.matchWorkbookSnapshot();
  });

  it('Charts displaying turns on', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 1, 'light', true, [FEATURE_CHARTS]);
    cy.matchWorkbookSnapshot();
  });
});
