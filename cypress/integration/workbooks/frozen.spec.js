
import * as fileNames from '../../support/fileNames/xlsx';

// another part of this spec (scrolled screenshot) is in /cypress/ui/frozen.spec.js

context('Frozen panes and floating objects', () => {
  const countSheets = 7;
  [...new Array(countSheets)].forEach((_, sheetNum) => {
    it(`Should render ${fileNames.OBJECTS_AND_FROZEN} - tab ${sheetNum}`, () => {
      cy.loadSheetInSV(fileNames.OBJECTS_AND_FROZEN, sheetNum);
      cy.assertColumnWidths([64, 64, 64, 64]);
      cy.matchWorkbookSnapshot();
    });
  });
});

context('Frozen panes and floating objects (charts)', () => {
  const countSheets = 7;
  [...new Array(countSheets)].forEach((_, sheetNum) => {
    it(`Should render ${fileNames.OBJECTS_CHARTS_AND_FROZEN} - tab ${sheetNum}`, () => {
      cy.loadSheetInSV(fileNames.OBJECTS_CHARTS_AND_FROZEN, sheetNum);
      cy.assertColumnWidths([64, 64, 64, 64]);
      cy.matchWorkbookSnapshot();
    });
  });
});

context('Frozen panes and merged objects', () => {
  const countSheets = 7;
  [...new Array(countSheets)].forEach((_, sheetNum) => {
    it(`Should render ${fileNames.MERGED_AND_FROZEN} - tab ${sheetNum}`, () => {
      cy.loadSheetInSV(fileNames.MERGED_AND_FROZEN, sheetNum);
      cy.assertColumnWidths([64, 64, 64, 64]);
      cy.matchWorkbookSnapshot();
    });
  });
});
