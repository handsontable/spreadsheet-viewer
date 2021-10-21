import config, { PerformanceMeasurementsConfig } from './config';
import { PerformanceMarker } from './markers';
import { executePerformanceMeasurement, PerformanceMeasurement } from './measurement';
import { COLORS, displayReportInConsole, displayReportsComparisonInConsole } from './reports/consoleReport';
import { generateCSVReport, readCSVReport } from './reports/csvReport';
import { PerformanceMeasurementReport } from './reports/report';
import { getScriptArgs } from './reports/scriptArgs';
import { STATISTICS } from './statistics';

const buildPerformanceMeasurements = (
  {
    scenarios, appMarkers, browserMarkers, statistic
  }: PerformanceMeasurementsConfig,
  numberOfSamples: number
): PerformanceMeasurement[] => // eslint-disable-line object-curly-newline
  scenarios.map<PerformanceMeasurement>(({ name, action }) => ({ // eslint-disable-line implicit-arrow-linebreak
    statistic: STATISTICS[statistic],
    appMarkers,
    browserMarkers,
    name,
    action,
    numberOfSamples,
  }));

(async() => {
  const { newFileName, baselineFileName, numberOfSamples: argsNumberOfSamples } = getScriptArgs();

  const performanceMeasurements = buildPerformanceMeasurements(
    config,
    argsNumberOfSamples === null ? 100 : argsNumberOfSamples
  );

  const measurements: PerformanceMeasurementReport[] = [];
  const { appMarkers, browserMarkers, statistic } = config;
  const performanceMarkers: PerformanceMarker[] = [...appMarkers, ...browserMarkers];
  const statisticFunction = STATISTICS[statistic];

  for (const measurement of performanceMeasurements) { // eslint-disable-line no-restricted-syntax
    const { name } = measurement;
    const timings = await executePerformanceMeasurement(measurement); // eslint-disable-line no-await-in-loop

    measurements.push({
      name,
      timings
    });
  }
  console.log(COLORS.green, '\n\nMeasurements have been completed. Presenting results:\n');

  if (baselineFileName) {
    const baselineMeasurements = await readCSVReport(baselineFileName);

    displayReportsComparisonInConsole(measurements, baselineMeasurements, performanceMarkers, statisticFunction, baselineFileName);
  } else {
    displayReportInConsole(measurements, performanceMarkers, statisticFunction);
  }

  if (newFileName) {
    await generateCSVReport(newFileName, performanceMarkers, measurements);
  }
})();
