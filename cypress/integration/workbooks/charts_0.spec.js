import * as fileNames from '../../support/fileNames/xlsx';
import { FEATURE_CHARTS } from '../../support/features';

context('Charts', () => {
  const dataProvider = [
    { inFile: fileNames.AREA_CHARTS },
    { inFile: fileNames.BAR_CHARTS },
    { inFile: fileNames.COLUMN_CHARTS },
    { inFile: fileNames.FORMAT_AREA_CHARTS }
  ];

  dataProvider.forEach(({ inFile }) => {
    it(`should render "${inFile}"`, () => {
      cy.makeSnapshotsForWholeFile(inFile, [FEATURE_CHARTS]);
    });
  });
});
