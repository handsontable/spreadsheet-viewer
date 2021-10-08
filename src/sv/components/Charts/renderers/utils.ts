import { SeriesDefinition, MarkerFormatDefinition } from '../abstracts';

// Enable or disable animations in chart (if animations are enabled then tests are willing to fail)
const enableAnimations = false;
const enabledAnimationConfig = {};
const disabledAnimationConfig = {
  appear: {
    animation: 'fadeIn',
    easing: 'easeQuadIn',
    delay: 0,
    duration: 0
  }
};

export const animationConfig = enableAnimations ? enabledAnimationConfig : disabledAnimationConfig;

const getSeriesLabel = (serie: SeriesDefinition | undefined, idx: number) => {
  const value = serie?.label?.value;
  if (value) {
    return value;
  }
  const labellessSerieLabel = `Series${idx + 1}`;
  return labellessSerieLabel;
};

const normalizeLabels = (series: SeriesDefinition[]): SeriesDefinition[] => {
  const labels = new Set();
  const output: SeriesDefinition[] = JSON.parse(JSON.stringify(series));
  output.forEach((s, i) => {
    let label = getSeriesLabel(s, i);
    if (labels.has(label)) {
      label = getSeriesLabel(undefined, i);
    }
    labels.add(label);
    if (s.label) {
      s.label.value = label;
    }
  });
  return output;
};

type ConvertedData = Record<string | number, Record<string | number, string | number>>;
export const chartSeriesToData = (chartSeries: SeriesDefinition[]) => {
  const data: ConvertedData = {};
  const normalizedLabelSeries = normalizeLabels(chartSeries);
  const firstSerieValues = { values: normalizedLabelSeries[0].values.values?.slice() || [] };
  normalizedLabelSeries.forEach((serie, serieIdx) => {
    const label = getSeriesLabel(serie, serieIdx);
    // When serie has no categories (labels on x axis),
    // use first row of values as categories, but still use it as serie values.
    // This is in line with excel behavior
    if (!serie.categories) {
      serie.categories = firstSerieValues;
    }
    serie.categories.values?.forEach((cat, idx) => {
      data[cat] = data[cat] || {};
      data[cat][label] = (() => {
        const o = serie.values.values?.[idx];
        if (o === undefined || o === null) {
          return 0;
        }

        const parsed = Number(o);
        if (Number.isNaN(parsed)) {
          return 0;
        }
        return parsed;
      })();
    });
  });
  let series: string[] = [];
  const result = Object.entries(data).map(([key, value]) => {
    series = [...series, ...Object.keys(value)];
    return {
      ...value,
      key
    };
  });
  return { data: result, series: [...new Set(series)] };
};

export const imkToMarkerShape = {
  1: {
    back: { shape: 'square' },
    front: { shape: 'hollowSquare' }
  },
  2: {
    back: { shape: 'diamond' },
    front: { shape: 'hollowDiamond' }
  },
  3: {
    back: { shape: 'triangle' },
    front: { shape: 'hollowTriangle' }
  },
  4: {
    front: { shape: 'cross' },
    back: { shape: 'square' }
  },
  5: {
    front: { shape: 'hexagon' },
    // frontSpecial: { shape: 'line' },
    back: { shape: 'square' }
  },
  6: {
    // front: { shape: 'hyphen', style: { lineWidth: 10 }, size: 10 }
    front: { shape: 'hyphen' },
    back: { shape: 'hyphen' }
  },
  7: {
    front: { shape: 'hyphen' },
    back: { shape: 'hyphen' }
    // front: { shape: 'hyphen', style: { lineWidth: 10 }, size: 30 }
  },
  8: {
    back: { shape: 'circle' },
    front: { shape: 'hollowCircle' }
  },
  9: {
    front: { shape: 'plus' },
    back: { shape: 'square' }
  }
};

export const getMarkerDef = (series: SeriesDefinition[], type: string) => {
  return series.find(s => s.label?.value === type)?.markerFormat;
};

export enum MarkerComponentFlag {
  MARKER_COMPONENT_FRONT = 'fNotShowBrd',
  MARKER_COMPONENT_BACK = 'fNotShowInt'
}

export const hasMarkers = (chartSeries: SeriesDefinition[], type: keyof MarkerFormatDefinition) => {
  try {
    return chartSeries.find((s) => {
      try {
        if (s.markerFormat.imk <= 0) {
          return false;
        }
        return !s.markerFormat[type];
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
};
