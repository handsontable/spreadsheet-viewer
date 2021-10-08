
import * as fileNames from '../../support/fileNames/xlsx';

// another part of this spec (fullpage screenshot) is in /cypress/workbooks/frozen.spec.js

const sheetScrollPositons = [
  [0, 'bottomLeft'],
  [1, 'bottomLeft'],
  [2, 'bottomRight'],
  [3, 'topRight'],
  [4, 'topRight'],
  [5, 'bottomRight'],
  [6, 'bottomRight'],
];

context('Frozen panes and floating objects', () => {
  sheetScrollPositons.forEach(([sheetNum, position]) => {
    it(`Should render ${fileNames.OBJECTS_AND_FROZEN} - tab ${sheetNum} in UI scrolled to ${position}`, () => {
      cy.loadSheetInSV(fileNames.OBJECTS_AND_FROZEN, sheetNum);
      cy.goToWorksheetPosition(position);
      cy.matchUISnapshot();
    });
  });
});

context('Frozen panes and floating objects (charts)', () => {
  sheetScrollPositons.forEach(([sheetNum, position]) => {
    it(`Should render ${fileNames.OBJECTS_CHARTS_AND_FROZEN} - tab ${sheetNum} in UI scrolled to ${position}`, () => {
      cy.loadSheetInSV(fileNames.OBJECTS_CHARTS_AND_FROZEN, sheetNum);
      cy.goToWorksheetPosition(position);
      cy.matchUISnapshot();
    });
  });
});

context('Frozen panes and merged objects', () => {
  sheetScrollPositons.forEach(([sheetNum, position]) => {
    it(`Should render ${fileNames.MERGED_AND_FROZEN} - tab ${sheetNum} in UI scrolled to ${position}`, () => {
      cy.loadSheetInSV(fileNames.MERGED_AND_FROZEN, sheetNum);
      cy.goToWorksheetPosition(position);
      cy.matchUISnapshot();
    });
  });
});
