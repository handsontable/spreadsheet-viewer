import * as fileNames from '../../support/fileNames/xlsx';

const SV_HOT_MASTER_SELECTOR = 'div[role=tabpanel] .ht_master';

context('Load', () => {
  it('should load via a remote URL', () => {
    cy.visit('/index.html#licenseKey=demo');

    cy.window().then(($window) => {
      $window.postMessage({
        name: 'loadWorkbook',
        workbook: `/cypress/fixtures/${fileNames.FILE_GENERAL}`,
        sheet: 0
      });
    });

    cy.get(SV_HOT_MASTER_SELECTOR); // wait for Handsontable to be rendered

    cy.matchUISnapshot();
  });

  it('should load via a base64 URL', () => {
    cy.visit('/index.html#licenseKey=demo');

    cy.readFile(`cypress/fixtures/${fileNames.FILE_GENERAL}`, 'base64').then((rawContents) => {
      const dataURL = `data:application/vnd.ms-excel;base64,${rawContents}`;

      cy.window().then(($window) => {
        $window.postMessage({
          name: 'loadWorkbook',
          fileName: 'empty.xlsx',
          workbook: dataURL,
          sheet: 0
        });
      });
    });

    cy.get(SV_HOT_MASTER_SELECTOR); // wait for Handsontable to be rendered

    cy.matchUISnapshot();
  });

  it('should load via an ArrayBuffer', () => {
    cy.visit('/index.html#licenseKey=demo');

    cy.readFile(`cypress/fixtures/${fileNames.FILE_GENERAL}`, 'base64').then((f) => {
      const ab = Uint8Array.from(atob(f), c => c.charCodeAt(0)).buffer;

      cy.window().then(($window) => {
        $window.postMessage({
          name: 'loadWorkbook',
          workbook: ab,
          fileName: 'empty.xlsx',
          sheet: 0
        });
      });
    });

    cy.get(SV_HOT_MASTER_SELECTOR); // wait for Handsontable to be rendered

    cy.matchUISnapshot();
  });
});
