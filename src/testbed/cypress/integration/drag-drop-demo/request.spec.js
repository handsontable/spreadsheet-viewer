import { FILE_GENERAL } from '../../support/fileNames/xlsx';

const DEMO_IFRAME_SELECTOR = '#spreadsheet-viewer iframe';

context('Select cells', () => {
  beforeEach(() => {
    cy.uploadWorkbookInDemo(FILE_GENERAL);
  });

  // current selection selects 4 cells: A1, A2, B1, B2
  it('should select cells after keyboard combination', () => {
    // Click SHIFT + ALT simultaneously to trigger cells selection
    cy.get('body')
      .type('{shift}{alt}');

    cy.getIntoIFrameInDemo((iframe) => {
      cy.wrap(iframe)
        .getHandsontableCellInDemo(iframe, 0, 0)
        .should('have.class', 'area')
        .getHandsontableCellInDemo(iframe, 1, 1)
        .should('have.class', 'area');
    });
  });

  it('should get information about selected cells', () => {
    // to store selected cells range
    let range = [];

    // attach an event listener
    cy.window().then((window) => {
      cy.spy(window, 'postMessage').as('postMessage');

      window.addEventListener('message', (event) => {
        if (event.data.name === 'cellSelectionChanged') {
          console.log('LOG: event.data', event.data);
          range = event.data.range;
        }
      });
    });

    // perform a click which fires a selection request
    cy.getIntoIFrameInDemo((iframe) => {
      cy.wrap(iframe)
        .getHandsontableCellInDemo(iframe, 0, 0)
        .click();
    });

    // test post message call and range data
    cy.get('@postMessage')
      .should('be.calledOnce')
      .then(() => {
        expect(range).to.deep.eq([0, 0, 0, 0]);
      });
  });
});

context('Theme', () => {
  const lightBackground = 'rgb(245, 245, 245)';
  const darkBackground = 'rgb(55, 55, 55)';
  const appContainerSelector = '.sv-app-container';

  it('should begin in the dark theme by default', () => {
    cy.uploadWorkbookInDemo(FILE_GENERAL);

    cy.getIntoIFrameInDemo(() => {
      cy.get(appContainerSelector).should('have.css', 'background-color', darkBackground);
    });
  });

  it('should begin in the dark theme by if requested using themeStyleshet=dark', () => {
    cy.uploadWorkbookInDemo(FILE_GENERAL, '?themeStylesheet=dark');

    cy.getIntoIFrameInDemo(() => {
      cy.get(appContainerSelector).should('have.css', 'background-color', darkBackground);
    });
  });

  it('should begin in the dark theme by if requested using themeStyleshet with unknown value', () => {
    cy.uploadWorkbookInDemo(FILE_GENERAL, '?themeStylesheet=randomString1234');

    cy.getIntoIFrameInDemo(() => {
      cy.get(appContainerSelector).should('have.css', 'background-color', darkBackground);
    });
  });

  it('should toggle theme from dark to light and back to dark', () => {
    cy.uploadWorkbookInDemo(FILE_GENERAL);

    // Toggle to dark theme
    cy.get('body')
      .type('{t}');
    cy.getIntoIFrameInDemo(() => {
      cy.get(appContainerSelector).should('have.css', 'background-color', lightBackground);
    });
    // Toggle to light theme
    cy.get('body')
      .type('{t}');
    cy.getIntoIFrameInDemo(() => {
      cy.get(appContainerSelector).should('have.css', 'background-color', darkBackground);
    });
  });
});

context('Feature flags forwarding', () => {
  it('WHEN flags doesn\'t exist THEN nothing should be forwarded into sv', () => {
    cy.uploadWorkbookInDemo(FILE_GENERAL);
    cy.get(DEMO_IFRAME_SELECTOR).should('have.attr', 'src')
      .and('not.match', /[?&]flags=/);
  });

  it('WHEN flags exist THEN value should be forwarded into sv', () => {
    cy.uploadWorkbookInDemo(FILE_GENERAL, '?flags=any_flag,flag2');
    cy.get(DEMO_IFRAME_SELECTOR).should('have.attr', 'src')
      .and('match', /[?&]flags=any_flag,flag2(&|$)/);
  });
});
