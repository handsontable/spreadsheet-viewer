import * as fileNames from '../../support/fileNames/xlsx';
import { FEATURE_CHARTS } from '../../support/features';

context('Charts', () => {
  const dataProvider = [
    { inFile: fileNames.FORMAT_LEGEND },
    { inFile: fileNames.FORMAT_MAJOR_GRIDLINE_OPTIONS },
    { inFile: fileNames.FORMAT_PLOT_AREA },
    { inFile: fileNames.FORMAT_TRENDLINE }
  ];

  dataProvider.forEach(({ inFile }) => {
    it(`should render "${inFile}"`, () => {
      cy.makeSnapshotsForWholeFile(inFile, [FEATURE_CHARTS]);
    });
  });
});
