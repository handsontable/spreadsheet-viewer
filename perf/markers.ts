import { Page } from 'puppeteer';

export type BrowserPerformanceMarker = 'Nodes' | 'LayoutDuration' | 'RecalcStyleDuration' | 'ScriptDuration' | 'JSHeapUsedSize'
| 'firstPaint' | 'firstContentfulPaint' | 'largestContentfulPaint';
export type AppPerformanceMarker = 'parser' | 'parserReading' | 'parserFixing'
| 'interpreter' | 'interpreterStyleClone' | 'interpreterCss' | 'interpreterHotConfig'
| 'presentation' | 'presentationTabsParsing' | 'presentationTabsRendering' | 'presentationHotRendering';
export type PerformanceMarker = BrowserPerformanceMarker | AppPerformanceMarker;
export type MarkerTiming = number | null;
export type BrowserMarkersTimings = Partial<Record<BrowserPerformanceMarker, MarkerTiming>>;
export type AppMarkersTimings = Partial<Record<AppPerformanceMarker, MarkerTiming>>;
export type MarkerTimings = Partial<Record<BrowserPerformanceMarker | AppPerformanceMarker, MarkerTiming>>;
type MarkerData = [string, string, string];
type ExtractAppMarkerTimings = (markersData: MarkerData[]) => AppMarkersTimings;

export const MARKERS: Record<AppPerformanceMarker, AppPerformanceMarker> = {
  parser: 'parser',
  parserReading: 'parserReading',
  parserFixing: 'parserFixing',
  interpreter: 'interpreter',
  interpreterStyleClone: 'interpreterStyleClone',
  interpreterCss: 'interpreterCss',
  interpreterHotConfig: 'interpreterHotConfig',
  presentation: 'presentation',
  presentationTabsParsing: 'presentationTabsParsing',
  presentationTabsRendering: 'presentationTabsRendering',
  presentationHotRendering: 'presentationHotRendering',
};

const isPerfMarkingEnabled = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';
const runningPerfMarkers = new Set();

type MarkerFunction = (marker:AppPerformanceMarker) => void;

/**
 * Set up functions startPerfMarker and endPerfMarker. These functions show current timings in
 * DevTools as well as record markings for the performance tool.
 * The metrics are explained on the page: https://github.com/handsontable/spreadsheet-viewer-dev/wiki/Performance
 */
export const [startPerfMarker, endPerfMarker] = ((): [MarkerFunction, MarkerFunction] => {
  if (isPerfMarkingEnabled) {
    return [
      (marker) => {
        runningPerfMarkers.add(marker);
        console.time(marker);
        performance.mark(`${marker}Start`);
      },
      (marker) => {
        if (runningPerfMarkers.has(marker)) { // TODO `runningPerfMarkers` Set is used to prevent warnings about the timers not yet started. Investigate the root cause and remove this Set. More info: https://github.com/handsontable/spreadsheet-viewer-dev/pull/459#discussion_r439669165
          runningPerfMarkers.delete(marker);
          console.timeEnd(marker);
        }
        performance.mark(`${marker}End`);
      },
    ];
  }

  return [() => undefined, () => undefined];
})();

const extractAppMarkersTimings: ExtractAppMarkerTimings = (markersData) => {
  const appMarkersTimings = markersData.reduce<AppMarkersTimings>((markersTimings, [name, start, end]) => ({
    ...markersTimings,
    // performance.measure should return PerformanceEntry (and it does in browser) but for some reason lib.dom.d.ts has void as return type.
    // @ts-ignore
    [name]: window.performance.measure(name, start, end).duration,
  }), {});

  return appMarkersTimings;
};

export const getPerformanceMarkersTimings = async(
  page: Page,
  appMarkers: AppPerformanceMarker[]
): Promise<AppMarkersTimings> => {
  const appMarkersData: MarkerData[] = appMarkers.map(marker => [marker, `${marker}Start`, `${marker}End`]);
  const appMarkersTimings = await page.evaluate<ExtractAppMarkerTimings>(extractAppMarkersTimings, appMarkersData);

  return appMarkersTimings;
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getBrowserMarkersTimings = async(page: Page, browserMarkers: BrowserPerformanceMarker[]): Promise<BrowserMarkersTimings> => {
  const browserMetrics = await page.metrics();
  const markersInMS: BrowserPerformanceMarker[] = ['LayoutDuration', 'RecalcStyleDuration', 'ScriptDuration'];

  const result = browserMarkers.reduce<BrowserMarkersTimings>((browserMarkersTimings, marker) => {
    let metric = Number((browserMetrics as any)[marker] as number | undefined);

    if (markersInMS.includes(marker)) {
      metric *= 1000;
    }

    return Object.assign(
      browserMarkersTimings,
      { [marker]: metric }
    );
  }, {});

  result.firstPaint = await page.evaluate(() => performance.getEntriesByName('first-paint')[0]?.startTime || 0); // eslint-disable-line no-await-in-loop
  result.firstContentfulPaint = await page.evaluate(() => performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0); // eslint-disable-line no-await-in-loop
  result.largestContentfulPaint = await page.evaluate(() => (window as any).largestContentfulPaint || 0); // eslint-disable-line no-await-in-loop

  if (!result.firstPaint) {
    throw new Error('FP measurement timeout');
  }

  if (!result.firstContentfulPaint) {
    throw new Error('FCP measurement timeout');
  }

  if (!result.largestContentfulPaint) {
    throw new Error('LCP measurement timeout');
  }

  return result;
};
