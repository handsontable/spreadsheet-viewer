import * as fileNames from '../../support/fileNames/xlsx';

context('Cell formats', () => {
  const dataProvider = [
    { inFile: fileNames.ALIGNMENT },
    { inFile: fileNames.FONT_GROUP },
    { inFile: fileNames.NUMBER_FORMAT },
    { inFile: fileNames.CELLS_GROUP },
    { inFile: fileNames.EDITING_GROUP },
    { inFile: fileNames.STYLES_CELL_STYLES },
    { inFile: fileNames.STYLES_CONDITIONAL_FORMATTING },
    { inFile: fileNames.ALIGNMENT_TO_CENTER_WITH_WORD_WRAP },
    { inFile: fileNames.LEADING_SPACES_WITH_AND_WITHOUT_WORD_WRAP }
  ];

  dataProvider.forEach(({ inFile }) => {
    it(`should render "${inFile}"`, () => {
      cy.loadSheetInSV(inFile, 0);
      cy.makeSnapshotsForWholeFile(inFile);
    });
  });
});
