// @ts-nocheck

import { AppPerformanceMarker, BrowserPerformanceMarker, PerformanceMarker } from '../markers';
import { StatisticsFunction, STATISTICS, roundTo2ndDecimal } from '../statistics';
import { mapReportToStatistics, PerformanceMeasurementReport, PerformanceMeasurementStatistic } from './report';

interface PerformanceComparisonItem {
  [measurement: string]: number;
  diff: number;
}
type PerformanceComparisonReport = Partial<Record<AppPerformanceMarker | BrowserPerformanceMarker, PerformanceComparisonItem>>;

export const COLORS: Record<string, string> = {
  green: '\x1b[32m%s\x1b[0m',
  red: '\x1b[31m%s\x1b[0m',
  yellow: '\x1b[33m%s\x1b[0m',
};

const findScenarioStatisticByName = (scenarioName: string) => (statistics: PerformanceMeasurementStatistic) => statistics.name === scenarioName;

// effect: 🟢positive | 🔴negative | ~indifferent
const signToEmoji = (num: number) => {
  const threshold = 1;

  if (num > threshold) {
    return '🔴';
  }
  if (num < -threshold) {
    return '🟢';
  }

  // changes smaller than threshold are presented as indifferent
  return '~';
};

// certainty: ✅certain | ❓suspicious | 🗑uncertain
const rsdToEmoji = (rsd: number) => {
  const threshold = 1;

  if (rsd > threshold) {
    return '🗑';
  }
  if (rsd > threshold / 2) {
    return '✅ / 🗑';
  }
  return '✅';
};

/**
 * Don't believe any effect that is less than a standard deviation
 * Be highly suspicious if it is less than two standard deviations
 *
 * @source https://www.cse.unsw.edu.au/~cs9242/19/lectures/04b-perf.pdf
 */
const diffsToEmoji = (maxRsd: number, diffPercent: number) => {
  const absDiffPercent = Math.abs(diffPercent);

  if (absDiffPercent < maxRsd) {
    return '🗑'; // effect is less than a standard deviation
  }
  const emoji = signToEmoji(diffPercent);
  if (absDiffPercent < 2 * maxRsd) {
    return `${emoji} / 🗑`; // effect is suspicious (less than two standard deviations)
  }

  return `${emoji}`;
};

const roundedAverage = (values: number[]) => roundTo2ndDecimal(STATISTICS.average(values));

const averageRSDReport = (currentRSDValues: number[], baselineRSDValues?: number[], diffValues?: number[]) => {
  const currentRsd = roundedAverage(currentRSDValues);
  if (baselineRSDValues && diffValues) {
    const baselineRsd = roundedAverage(baselineRSDValues);
    const diff = roundedAverage(diffValues);
    console.log(`  Average RSD% (current): ${currentRsd} ${rsdToEmoji(currentRsd)}`);
    console.log(` Average RSD% (baseline): ${baselineRsd} ${rsdToEmoji(baselineRsd)}`);
    console.log(`           Average diff%: ${diff} ${diffsToEmoji(Math.max(currentRsd, baselineRsd), diff)}`);
    console.log('\nRSD% (relative standard deviation) tells how variable are the sample results.');
    console.log('The result is considered 🗑 if RSD% is higher than 1, or diff% is smaller than double RSD%.');
  } else {
    console.log(` Average RSD%: ${currentRsd} ${rsdToEmoji(currentRsd)}`);
    console.log('\nRSD% (relative standard deviation) tells how variable are the sample results.');
    console.log('The result is considered 🗑 if RSD% is higher than 1.');
  }
};

export const displayReportInConsole = (
  currentMeasurements: PerformanceMeasurementReport[],
  performanceMarkers: PerformanceMarker[],
  statisticFunction: StatisticsFunction
) => {

  const aggregateMapper = mapReportToStatistics(performanceMarkers, statisticFunction);
  const rsdMapper = mapReportToStatistics(performanceMarkers, STATISTICS.relstddev);

  const currentAggregateStatistics = currentMeasurements.map<PerformanceMeasurementStatistic>(aggregateMapper);
  const currentRSDStatistics = currentMeasurements.map<PerformanceMeasurementStatistic>(rsdMapper);
  const currentRSDValues = [];

  currentAggregateStatistics.forEach(({ name, timingsStatistic }) => {
    const currentRSDStatistic = currentRSDStatistics.find(findScenarioStatisticByName(name));

    const result = Object.entries(timingsStatistic).reduce<PerformanceComparisonReport>((timingsComparison, [marker, currentAggregate]) => {
      const currentRSD = currentRSDStatistic.timingsStatistic[marker];
      currentRSDValues.push(currentRSD);

      return Object.assign(timingsComparison, {
        [marker]: {
          current: currentAggregate,
          'currentRSD%': currentRSD,
          certainty: rsdToEmoji(currentRSD)
        }
      });
    }, {});

    console.log(`\n${name}`);
    console.table(result);
    averageRSDReport(currentRSDValues);
  });
};

export const displayReportsComparisonInConsole = (
  currentMeasurements: PerformanceMeasurementReport[],
  baselineMeasurements: PerformanceMeasurementReport[],
  performanceMarkers: PerformanceMarker[],
  statisticFunction: StatisticsFunction,
  baselineFileName: string
) => {
  const aggregateMapper = mapReportToStatistics(performanceMarkers, statisticFunction);
  const rsdMapper = mapReportToStatistics(performanceMarkers, STATISTICS.relstddev);
  const currentRSDValues = [];
  const baselineRSDValues = [];
  const diffPercentValues = [];

  const currentAggregateStatistics = currentMeasurements.map<PerformanceMeasurementStatistic>(aggregateMapper);
  const currentRSDStatistics = currentMeasurements.map<PerformanceMeasurementStatistic>(rsdMapper);
  const baselineAggregateStatistics = baselineMeasurements.map<PerformanceMeasurementStatistic>(aggregateMapper);
  const baselineRSDStatistics = baselineMeasurements.map<PerformanceMeasurementStatistic>(rsdMapper);

  currentAggregateStatistics.forEach(({ name, timingsStatistic }) => {
    const currentRSDStatistic = currentRSDStatistics.find(findScenarioStatisticByName(name));
    const baselineAggregateStatistic = baselineAggregateStatistics.find(findScenarioStatisticByName(name));
    const baselineRSDStatistic = baselineRSDStatistics.find(findScenarioStatisticByName(name));

    if (!baselineAggregateStatistic) {
      console.log(`no entry ${name} in baseline report`);

      return;
    }

    const result = Object.entries(timingsStatistic).reduce<PerformanceComparisonReport>((timingsComparison, [marker, currentAggregate]) => {
      const currentRSD = currentRSDStatistic.timingsStatistic[marker];
      currentRSDValues.push(currentRSD);
      const baselineAggregate = baselineAggregateStatistic.timingsStatistic[marker];
      const baselineRSD = baselineRSDStatistic.timingsStatistic[marker];
      baselineRSDValues.push(baselineRSD);

      const diff = currentAggregate - baselineAggregate;
      const diffPercent = baselineAggregate > 0 ? 100 * diff / baselineAggregate : 0;
      diffPercentValues.push(diffPercent);

      return Object.assign(timingsComparison, {
        [marker]: {
          current: currentAggregate,
          'currentRSD%': currentRSD,
          baseline: baselineAggregate,
          'baselineRSD%': baselineRSD,
          diff: roundTo2ndDecimal(diff),
          'diff%': roundTo2ndDecimal(diffPercent),
          interpret: diffsToEmoji(Math.max(currentRSD, baselineRSD), diffPercent)
        }
      });
    }, {});

    console.log(`\n${name} (current run compared to baseline ${baselineFileName}):`);
    console.table(result);
    averageRSDReport(currentRSDValues, baselineRSDValues, diffPercentValues);
  });
};
