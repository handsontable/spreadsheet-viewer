import { MULTI_LINE_MERGED_CELLS } from '../../support/fileNames/xlsx';

const SV_HOT_MASTER_SELECTOR = 'div[role=tabpanel] .ht_master';

it('should render the whole workbook', () => {
  cy.visit(`/index.html#workbookUrl=/cypress/fixtures/${MULTI_LINE_MERGED_CELLS}`);

  cy.get(SV_HOT_MASTER_SELECTOR);

  cy.matchUISnapshot();
});
