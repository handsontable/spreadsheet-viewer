import * as fileNames from '../../support/fileNames/xlsx';
import { FEATURE_CHARTS } from '../../support/features';

context('Charts', () => {
  const dataProvider = [
    { inFile: fileNames.FORMAT_DATA_SERIES },
    { inFile: fileNames.FORMAT_DATA_TABLE },
    { inFile: fileNames.FORMAT_ERROR_BARS },
    { inFile: fileNames.FORMAT_HORIZONTAL_AXIS },
  ];

  dataProvider.forEach(({ inFile }) => {
    it(`should render "${inFile}"`, () => {
      cy.makeSnapshotsForWholeFile(inFile, [FEATURE_CHARTS]);
    });
  });
});
