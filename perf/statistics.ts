import { AppMarkersTimings, PerformanceMarker, MarkerTimings } from './markers';

export type Statistic = 'average' | 'median' | 'maximum' | 'minimum' | 'stddev' | 'relstddev' | 'geometricMean';
export type StatisticsFunction = (samples: number[]) => number;

const extractSingleMarker = (marker: PerformanceMarker) => (markersTimings: MarkerTimings): number | undefined => markersTimings[marker] || undefined;

function mean(arr: number[]) {
  return (arr.reduce((prev, curr) => {
    return prev + curr;
  }) / arr.length);
}

export function geometricMean(arr: number[]) {
  const product = arr.reduce((prev, curr) => {
    return prev * curr;
  });

  return product ** (1 / arr.length); // ** = Math.pow
}

function variance(arr: number[]) {
  const dataMean = mean(arr);

  return mean(arr.map(val => (val - dataMean) ** 2)); // ** = Math.pow
}

function stddev(arr: number[]) { // standard deviation
  return Math.sqrt(variance(arr));
}

function relstddev(arr: number[]) { // relative standard deviation (https://en.wikipedia.org/wiki/Coefficient_of_variation)
  return 100 * Math.sqrt(variance(arr)) / mean(arr);
}

export const STATISTICS: Record<Statistic, StatisticsFunction> = {
  average: mean,
  median: (samples) => {
    const { length } = samples;
    const mid = Math.floor(length / 2);
    const sortedSamples = [...samples].sort((a, b) => a - b);

    return length % 2 !== 0 ? sortedSamples[mid] : (sortedSamples[mid - 1] + sortedSamples[mid]) / 2;
  },
  maximum: samples => Math.max.apply(null, samples),
  minimum: samples => Math.min.apply(null, samples),
  stddev,
  relstddev,
  geometricMean
};

export const roundTo2ndDecimal = (num: number) => Math.round(num * 100) / 100;

export const calculateMarkersTimingsStatistic = (
  markersTimings: AppMarkersTimings[],
  markers: PerformanceMarker[],
  statistic: StatisticsFunction
): AppMarkersTimings => {
  return markers.reduce<AppMarkersTimings>((timingsStatistics, marker) => {
    const markerTimings = markersTimings
      .map(extractSingleMarker(marker))
      .filter((x): x is number => {
        if (typeof x === 'number') {
          return true;
        }

        throw new TypeError(`Could not find marker ${x}`);
      });

    return Object.assign(timingsStatistics, {
      [marker]: roundTo2ndDecimal(statistic(markerTimings))
    });
  }, {});
};
