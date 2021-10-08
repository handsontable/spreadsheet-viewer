import { PerformanceMarker, MarkerTimings } from '../markers';
import { calculateMarkersTimingsStatistic, StatisticsFunction } from '../statistics';

export interface PerformanceMeasurementReport {
  name: string;
  timings: MarkerTimings[];
}

export interface PerformanceMeasurementStatistic {
  name: string;
  timingsStatistic: MarkerTimings;
}

export const mapReportToStatistics = (performanceMarkers: PerformanceMarker[], statisticFunction: StatisticsFunction) =>
  ({ name, timings }: PerformanceMeasurementReport): PerformanceMeasurementStatistic => ({ // eslint-disable-line implicit-arrow-linebreak
    timingsStatistic: calculateMarkersTimingsStatistic(timings, performanceMarkers, statisticFunction),
    name,
  });
