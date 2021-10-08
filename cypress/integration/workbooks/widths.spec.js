import * as fileNames from '../../support/fileNames/xlsx';

context('Calculation columns width through OS', () => {
  const dataProvider = [
    {
      inFile: fileNames.SHORT_TEXT_ARIAL_22_AS_DEFAULT_FONT_EXCEL_WIN,
      expectedColumnWidths: [131, 131, 131], // TODO expected column widths should be [144, 144, 144], @see https://github.com/handsontable/spreadsheet-viewer-dev/issues/517
    },
    {
      inFile: fileNames.SHORT_TEXT_DEFAULT_WIDTH_100_EXCEL_MAC,
      expectedColumnWidths: [133, 133, 133]
    },
    {
      inFile: fileNames.SHORT_TEXT_DEFAULT_WIDTH_100_EXCEL_MAC2WIN,
      expectedColumnWidths: [133, 133, 133]
    },
    {
      inFile: fileNames.SHORT_TEXT_DEFAULT_WIDTH_100_EXCEL_WIN,
      expectedColumnWidths: [100, 100, 100]
    },
    {
      inFile: fileNames.SHORT_TEXT_MENLO_20_AS_DEFAULT_FONT_EXCEL_MAC,
      expectedColumnWidths: [150, 150, 150], // TODO expected column widths should be [160, 160, 160], @see https://github.com/handsontable/spreadsheet-viewer-dev/issues/517
    },
    {
      inFile: fileNames.SHORT_TEXT_MENLO_20_AS_DEFAULT_FONT_EXCEL_MAC2WIN,
      expectedColumnWidths: [149, 149, 149], // TODO expected column widths should be [160, 160, 160], @see https://github.com/handsontable/spreadsheet-viewer-dev/issues/517
    },
    {
      inFile: fileNames.SHORT_TEXT_WIDTH_200_EXCEL_MAC,
      expectedColumnWidths: [88, 88, 267, 88],
    },
    {
      inFile: fileNames.SHORT_TEXT_WIDTH_200_EXCEL_WIN,
      expectedColumnWidths: [64, 64, 200, 64]
    }
  ];
  dataProvider.forEach(({ inFile, expectedColumnWidths }) => {
    it(`should render "${inFile}"`, () => {
      cy.loadSheetInSV(inFile, 0);
      cy.assertColumnWidths(expectedColumnWidths);
      cy.matchWorkbookSnapshot();
    });
  });
});
