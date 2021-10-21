import * as fileNames from '../../support/fileNames/xlsx';

context('Upload', () => {
  it('should upload a file', () => {
    cy.uploadWorkbookInDemo(fileNames.FILE_GENERAL);
    cy.getIntoIFrameInDemo((iframe) => {
      cy
        .wrap(iframe)
        .getSheetTabInSV(0)
        .should('contain.text', 'Sheet1');
    });
  });

  it('should check if the first file is cleaned up after uploaded the second file', () => {
    const floatingBoxFromFileA = {
      left: null,
      top: null
    };

    // First upload file A
    cy.uploadWorkbookInDemo(fileNames.FILE_TABS_A);
    cy.getIntoIFrameInDemo((iframe) => {
      cy
        .getSheetTabInSV(0)
        .should('contain.text', 'First');

      cy
        .get('.sv-handsontable-floating-box')
        .then(($box) => {
          floatingBoxFromFileA.left = $box[0].style.left;
          floatingBoxFromFileA.top = $box[0].style.top;
        });

      cy
        .getHandsontableCellInDemo(iframe, 3, 1)
        .should('contain.text', 'test-tabs-a');
    });

    // Now upload file B
    cy.uploadWorkbookInDemo(fileNames.FILE_TABS_B);
    cy.getIntoIFrameInDemo((iframe) => {
      cy
        .getSheetTabInSV(0)
        .should('contain.text', 'First');

      cy
        .get('.sv-handsontable-floating-box')
        .then(($box) => {
          expect($box[0].style.left).to.not.equal(floatingBoxFromFileA.left);
          expect($box[0].style.top).to.not.equal(floatingBoxFromFileA.top);
        });

      cy
        .getHandsontableCellInDemo(iframe, 3, 1)
        .should('not.contain.text', 'test-tabs-a');
    });
  });

  it('should load file from files list in the sidebar when the start screen is on', () => {
    // show sidebar on F keyboard press
    cy.get('body').type('f');

    // load the second XLSX file
    cy.get('.files-list > a:nth-of-type(2)')
      .click()
      .firstTabShouldHaveTextInDemo('Functions');
  });

  it('should load file from files list in the sidebar when another file was already loaded', () => {
    cy.uploadWorkbookInDemo(fileNames.FILE_GENERAL);
    cy.firstTabShouldHaveTextInDemo('Sheet1');

    // show sidebar on F keyboard press
    cy.getIntoIFrameInDemo((iframe) => {
      cy
        .getHandsontableCellInDemo(iframe, 0, 0)
        .type('f');
    });

    // load the second XLSX file
    cy.get('.files-list > a:nth-of-type(2)')
      .click()
      .firstTabShouldHaveTextInDemo('Functions');
  });
});
