import * as fileNames from '../../support/fileNames/xlsx';
import { FEATURE_CHARTS } from '../../support/features';

context('Charts', () => {
  const dataProvider = [
    { inFile: fileNames.FORMAT_AXIS_TITLE_HORIZONTAL },
    { inFile: fileNames.FORMAT_AXIS_TITLE_VERTICAL },
    { inFile: fileNames.FORMAT_CHART_TITLE },
    { inFile: fileNames.FORMAT_DATA_LABELS },
  ];

  dataProvider.forEach(({ inFile }) => {
    it(`should render "${inFile}"`, () => {
      cy.makeSnapshotsForWholeFile(inFile, [FEATURE_CHARTS]);
    });
  });
});
