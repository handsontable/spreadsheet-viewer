import { promises as fs } from 'fs';
import path from 'path';

import webdriver, { Builder, WebDriver } from 'selenium-webdriver';

import * as chai from 'chai';

const testTimeout = 10000;

const urlsEnv = process.env.URLS;

if (urlsEnv === undefined) {
  throw new TypeError('URLS environment variable is required.');
}

const urls = urlsEnv.split(' ');

const sanitizeURLToFilename = (url: string): string => url.split('').filter(char => /[A-Za-z0-9.]/.test(char)).join('');

const waitInIframeFor = async(
  driver: WebDriver,
  selector: string,
  timeout: number
) => {
  await driver.wait(webdriver.until.ableToSwitchToFrame(0));
  await driver.wait(
    webdriver.until.elementLocated(webdriver.By.css(selector)),
    timeout
  );
};

const takeScreenshot = async(driver: WebDriver, screenshotName: string) => {
  const screenshotBase64 = await driver.takeScreenshot();
  await fs.writeFile(
    path.join(__dirname, `quickstart-${screenshotName}.png`),
    screenshotBase64,
    'base64'
  );
};

const testUrlForSelectors = async(url: string, selectors: string[]) => {
  const driver = await new Builder()
    .forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();

  await driver.get(url);

  const results = new Map();
  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    try {
      await waitInIframeFor(driver, selector, testTimeout); // eslint-disable-line no-await-in-loop
      results.set(selector, true);
    } catch (e) {
      results.set(selector, false);
    }
  }

  await takeScreenshot(driver, sanitizeURLToFilename(url));

  driver.quit();

  results.forEach((value, key) => {
    chai.assert.equal(
      value,
      true,
      `The expected selector '${key}' was not found`
    );
  });
};

describe('SpreadsheetViewer integration tests', () => {
  for (const url of urls) { // eslint-disable-line no-restricted-syntax
    it(`should load sv in ${url}`, async() => {
      const selectors = ['.ht_master td'];
      await testUrlForSelectors(url, selectors); // eslint-disable-line no-await-in-loop
    });
  }
});
