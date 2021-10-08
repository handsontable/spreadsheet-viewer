import Puppeteer, { Browser } from 'puppeteer';
import * as readline from 'readline';
import config, { PerformanceMeasurementsConfig } from './config';
import {
  AppMarkersTimings,
  AppPerformanceMarker,
  BrowserPerformanceMarker,
  getBrowserMarkersTimings,
  getPerformanceMarkersTimings,
  MarkerTimings
} from './markers';
import { COLORS } from './reports/consoleReport';
import { ScenarioAction } from './scenarios';
import { StatisticsFunction } from './statistics';

export interface PerformanceMeasurement {
  name: string;
  numberOfSamples: number;
  appMarkers: AppPerformanceMarker[];
  browserMarkers: BrowserPerformanceMarker[];
  statistic: StatisticsFunction;
  action: ScenarioAction;
}

const notifySamplingProgress = (step: number, totalSteps: number) => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`PROGRESS: ${step + 1}/${totalSteps}`);
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @source https://gist.github.com/addyosmani/c053f68aead473d7585b45c9e8dce31e
 */
function calcLCP() {
  const _window = window as any;
  _window.largestContentfulPaint = 0;

  const observer = new PerformanceObserver((entryList: PerformanceObserverEntryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];

    // @ts-ignore
    _window.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
  });

  observer.observe({ type: 'largest-contentful-paint', buffered: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      observer.takeRecords();
      observer.disconnect();
      console.log('LCP:', _window.largestContentfulPaint);
    }
  });
}

const takeScenarioSample = async(
  browser: Browser,
  scenarioAction: ScenarioAction,
  appMarkers: AppPerformanceMarker[],
  browserMarkers: BrowserPerformanceMarker[]
): Promise<MarkerTimings> => {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(calcLCP);

  await scenarioAction(page, config);
  await sleep(2500); // wait for measurements without affecting Puppeteer performance
  const isHandsontableRendered = await page.evaluate(() => {
    const SV_BODY_FONTS_LOADED_SELECTOR = 'body[data-webfonts-loaded]';
    const SV_HOT_MASTER_SELECTOR = 'div[role=tabpanel] .ht_master';
    return !!document.querySelector(`${SV_BODY_FONTS_LOADED_SELECTOR} ${SV_HOT_MASTER_SELECTOR}`);
  });
  if (!isHandsontableRendered) {
    throw new Error('Handsontable was not rendered during the sleep time');
  }

  const sampleMarkersTimings = await getPerformanceMarkersTimings(page, appMarkers);
  const browserPerformanceTimings = await getBrowserMarkersTimings(page, browserMarkers);

  await page.close();

  return ({
    ...sampleMarkersTimings,
    ...browserPerformanceTimings,
  });
};

export const measureScenario = async(
  scenarioAction: ScenarioAction,
  appMarkers: AppPerformanceMarker[],
  browserMarkers: BrowserPerformanceMarker[],
  samples: number
): Promise<AppMarkersTimings[]> => {
  const browser = await Puppeteer.launch({
    // args: ['--auto-open-devtools-for-tabs'],
    headless: true
  }).catch((error) => {
    console.log(COLORS.yellow, 'Puppeteer error while launching browser! Make sure that Chromium is installed by running "node ./node_modules/puppeteer/install.js"');

    throw Error(error);
  });

  if (!browser) {
    throw Error('Puppeteer did not launch browser!');
  }

  const samplesTimings: AppMarkersTimings[] = [];
  for (let sampleCount = 0; sampleCount < samples; sampleCount++) {
    notifySamplingProgress(sampleCount, samples);
    // eslint-disable-next-line no-await-in-loop
    const sampleTimings = await takeScenarioSample(browser, scenarioAction, appMarkers, browserMarkers);
    // eslint-disable-next-line no-await-in-loop
    samplesTimings.push(sampleTimings);
  }

  await browser.close();

  return samplesTimings;
};

export const executePerformanceMeasurement = async({
  name, numberOfSamples, appMarkers, browserMarkers, action
}: PerformanceMeasurement): Promise<AppMarkersTimings[]> => {
  try {
    console.log(
      COLORS.green,
      `\n\n=================================================================\nStart scenario measurement: ${name}\nNumber of samples: ${numberOfSamples}\n`
    );

    const scenarioResults = await measureScenario(action, appMarkers, browserMarkers, numberOfSamples);
    console.log(COLORS.green, '\n\nScenario measurement completed!');

    return scenarioResults;
  } catch (error) {
    console.log(COLORS.red, `\n\nError while running performance scenario "${name}"!`);
    console.log(error);

    process.exit(1);
  }
};
