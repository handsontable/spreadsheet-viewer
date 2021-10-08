import { Page } from 'puppeteer';
import { PerformanceMeasurementsConfig } from './config';
import { COLORS } from './reports/consoleReport';
import { FEATURE_CHARTS } from '../src/sv/utils/featureFlags';

export type ScenarioAction = (page: Page, config: PerformanceMeasurementsConfig) => Promise<void>;
export interface PerformanceScenario {
  name: string;
  action: ScenarioAction;
}

export const fileNames = {
  borders: 'borders.xlsx',
  charts: 'charts.xlsx',
  embeds: 'embeds.xlsx',
  mergedCells: 'merged-cells.xlsx',
  tableCustomized: 'table-customized.xlsx',
  textHorizontalOverlap: 'text-horizontal-overlap.xlsx',
  sheetRowColumnStyling: 'sheet-row-column-styling.xlsx',
  stressCharts: 'stress-charts.xlsx',
  stressEmbeds: 'stress-embeds.xlsx',
  stressFormats: 'stress-formats.xlsx',
};

const openSingleFixtureOnTab = (fixtureName: string, tab: number) => async(page: Page, config: PerformanceMeasurementsConfig) => {
  const filePath = `/cypress/fixtures/${fixtureName}`;
  const url = `${config.appAddress}?workbookUrl=${filePath}&sheet=${tab}&flags=${FEATURE_CHARTS}`;
  await page.goto(url, { timeout: 3000 }).catch((error) => {
    console.log(
      COLORS.yellow,
      `Puppeteer could not open application under ${config.appAddress}. Make sure that server is running "yarn serve:sv"`
    );

    throw Error(error);
  });
};

export const scenarios = {
  [fileNames.borders]: {
    name: fileNames.borders,
    action: openSingleFixtureOnTab(fileNames.borders, 0),
  },

  [fileNames.charts]: {
    name: fileNames.charts,
    action: openSingleFixtureOnTab(fileNames.charts, 1),
  },

  [fileNames.embeds]: {
    name: fileNames.embeds,
    action: openSingleFixtureOnTab(fileNames.embeds, 0),
  },

  [fileNames.mergedCells]: {
    name: fileNames.mergedCells,
    action: openSingleFixtureOnTab(fileNames.mergedCells, 0),
  },

  [fileNames.tableCustomized]: {
    name: fileNames.tableCustomized,
    action: openSingleFixtureOnTab(fileNames.tableCustomized, 0),
  },

  [fileNames.textHorizontalOverlap]: {
    name: fileNames.textHorizontalOverlap,
    action: openSingleFixtureOnTab(fileNames.textHorizontalOverlap, 0),
  },

  [fileNames.sheetRowColumnStyling]: {
    name: fileNames.sheetRowColumnStyling,
    action: openSingleFixtureOnTab(fileNames.sheetRowColumnStyling, 0),
  },

  [fileNames.stressCharts]: {
    name: fileNames.stressCharts,
    action: openSingleFixtureOnTab(fileNames.stressCharts, 0),
  },

  [fileNames.stressEmbeds]: {
    name: fileNames.stressEmbeds,
    action: openSingleFixtureOnTab(fileNames.stressEmbeds, 0),
  },

  [fileNames.stressFormats]: {
    name: fileNames.stressFormats,
    action: openSingleFixtureOnTab(fileNames.stressFormats, 0),
  },
};
