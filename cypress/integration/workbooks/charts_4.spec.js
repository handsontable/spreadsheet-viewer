import * as fileNames from '../../support/fileNames/xlsx';
import { FEATURE_CHARTS } from '../../support/features';

context('Charts', () => {
  const dataProvider = [
    { inFile: fileNames.FORMAT_VERTICAL_AXIS },
    { inFile: fileNames.LINE_CHARTS },
    { inFile: fileNames.PIE_CHARTS },
    { inFile: fileNames.QUICK_LAYOUTS }
  ];

  dataProvider.forEach(({ inFile }) => {
    it(`should render "${inFile}"`, () => {
      cy.makeSnapshotsForWholeFile(inFile, [FEATURE_CHARTS]);
    });
  });
});
