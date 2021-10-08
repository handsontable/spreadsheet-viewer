import * as fileNames from '../../support/fileNames/xlsx';
import { FEATURE_CHARTS } from '../../support/features';

context(fileNames.CHARTS, () => {
  it('should render tab 0', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 0);
    cy.assertColumnWidths([87, 87, 87]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 1', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 1, 'dark', true, [FEATURE_CHARTS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 2', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 2, 'dark', true, [FEATURE_CHARTS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 3', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 3);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 4', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 4, 'dark', true, [FEATURE_CHARTS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 5', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 5);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 6', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 6, 'dark', true, [FEATURE_CHARTS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 7', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 7, 'dark', true, [FEATURE_CHARTS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 8', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 8);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 9', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 9, 'dark', true, [FEATURE_CHARTS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 10', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 10);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 11', () => {
    cy.loadSheetInSV(fileNames.CHARTS, 11);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });
});

context(fileNames.CHARTS_NO_DATA, () => {
  it('should render empty chart', () => {
    cy.loadSheetInSV(fileNames.CHARTS_NO_DATA, 0, 'dark', true, [FEATURE_CHARTS]);
    cy.assertColumnWidths([88, 88, 88]);
    cy.matchWorkbookSnapshot();
  });
});

context(fileNames.CHART_LABELLESS_SERIES, () => {
  it('should properly render chart with labelless series', () => {
    cy.loadSheetInSV(fileNames.CHART_LABELLESS_SERIES, 0, 'dark', true, [FEATURE_CHARTS]);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });
});

context(fileNames.CHART_SHEET, () => {
  it('should render tab 0', () => {
    cy.loadSheetInSV(fileNames.CHART_SHEET, 0);
    cy.matchWorkbookSnapshot();
  });

  it('should render tab 1', () => {
    cy.loadSheetInSV(fileNames.CHART_SHEET, 1);
    cy.assertColumnWidths([64, 64, 64]);
    cy.matchWorkbookSnapshot();
  });
});
