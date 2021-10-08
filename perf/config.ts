import { AppPerformanceMarker, BrowserPerformanceMarker, MARKERS } from './markers';
import { fileNames, scenarios, PerformanceScenario } from './scenarios';
import { Statistic } from './statistics';

export interface PerformanceMeasurementsConfig {
  // Could be transformed to Statistic[], and more than one statistic could be calculated.
  statistic: Statistic;
  // List of markers defined in application.
  appMarkers: AppPerformanceMarker[];
  browserMarkers: BrowserPerformanceMarker[];
  scenarios: PerformanceScenario[];
  appAddress: string;
}

const PERFORMANCE_MEASUREMENT_CONFIG: PerformanceMeasurementsConfig = {
  appAddress: 'http://localhost:5000/index.html',
  statistic: 'median',
  appMarkers: [
    MARKERS.parser,
    MARKERS.parserReading,
    MARKERS.parserFixing,
    MARKERS.interpreter,
    MARKERS.interpreterStyleClone,
    MARKERS.interpreterCss,
    MARKERS.interpreterHotConfig,
    MARKERS.presentation,
    MARKERS.presentationTabsParsing,
    MARKERS.presentationTabsRendering,
    MARKERS.presentationHotRendering,
  ],
  browserMarkers: ['Nodes', 'LayoutDuration', 'RecalcStyleDuration', 'ScriptDuration', 'JSHeapUsedSize', 'firstPaint', 'firstContentfulPaint', 'largestContentfulPaint'],
  scenarios: [scenarios[fileNames.stressCharts], scenarios[fileNames.stressEmbeds], scenarios[fileNames.stressFormats]]
};

export default PERFORMANCE_MEASUREMENT_CONFIG;
