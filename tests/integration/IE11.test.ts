import { promises as fs } from 'fs';
import path from 'path';

import webdriver from 'selenium-webdriver';
import * as chai from 'chai';
import { FEATURE_CHARTS } from '../../src/sv/utils/featureFlags';

const testTimeout = 10000;

const waitFor = async(driver: any, selector: string, timeout: number) => {
  await driver.wait(
    webdriver.until.elementLocated(webdriver.By.css(selector)),
    timeout
  );
};

const lastElementOfArray = <T>(array: T[]): T => array[array.length - 1];

const takeScreenshot = async(driver: any, screenshotName: string) => {
  const screenshotBase64 = await driver.takeScreenshot();
  await fs.writeFile(path.join(__dirname, '../..', `ie11-${screenshotName}.png`), screenshotBase64, 'base64');
};

const testUrlForSelectors = async(url: string, selectors: string[]) => {
  let capabilities: webdriver.Capabilities = null as any;
  const driverPath = path.join(
    __dirname,
    '../../node_modules/iedriver/lib/iedriver'
  );
  process.env.PATH = `${process.env.PATH};${driverPath};`;
  capabilities = webdriver.Capabilities.ie();
  capabilities.set('ignoreProtectedModeSettings', true);
  capabilities.set('ignoreZoomSetting', true);
  const driver = await new webdriver.Builder()
    .withCapabilities(capabilities)
    .build();

  await driver.manage().setTimeouts({
    script: 60000
  });

  await driver.get(url);

  const results = new Map();
  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    try {
      await waitFor(driver, selector, testTimeout); // eslint-disable-line no-await-in-loop
      results.set(selector, true);
    } catch (e) {
      results.set(selector, false);
    }
  }

  const screenshotName = lastElementOfArray(url.split('/'));
  await takeScreenshot(driver, screenshotName);

  driver.quit();

  results.forEach((value, key) => {
    chai.assert.equal(value, true, `The expected selector '${key}' was not found`);
  });
};

describe('SpreadsheetViewer integration tests', () => {
  it('should load empty.xlsx in IE11', async() => {
    const url = `http://localhost:5000/index.html?workbookUrl=/cypress/fixtures/empty.xlsx&sheet=0&flags=${FEATURE_CHARTS}`;
    const selectors = ['.ht_master td'];
    await testUrlForSelectors(url, selectors);
  });

  it('should load charts.xlsx sheet 1 in IE11', async() => {
    const url = `http://localhost:5000/index.html?workbookUrl=/cypress/fixtures/charts.xlsx&sheet=1&flags=${FEATURE_CHARTS}`;
    const selectors = ['.ht_master td', '.sv-handsontable-chart .sv-chart-title', '.sv-handsontable-chart canvas'];
    await testUrlForSelectors(url, selectors);
  });
});
