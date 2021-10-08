import type { WorkSheet } from '@handsontable/js-xlsx';
import { render } from 'react-dom';
import * as React from 'react';
import {
  chartByType,
} from '../../Charts';
import { EmbeddedChart } from './abstracts';
import {
  ChartFormulaPointReference,
  ChartFormulaRangeReference,
  ChartFormulaType,
  FormulaField, SeriesDefinition
} from '../../Charts/abstracts';
import { spreadsheetColumnLabel } from '../../../utils/SpreadsheetService';
import { Placeholder } from './unimplementedPlaceholder/Placeholder';
import { decreaseLazyEmbedsCounter } from './lazyEmbedsCounter';
import { FloatingObjectRenderer } from '../FloatingBoxPlugin';

const DEFAULT_CHART_TITLE = '';

const resolvePoint = (ref: ChartFormulaPointReference, data: WorkSheet) => {
  const col = spreadsheetColumnLabel(ref.c);
  const row = ref.r + 1;
  const cellId = `${col}${row}`;
  const cellData = data[cellId];
  if (!cellData) {
    return null;
  }
  return cellData.v;
};

const resolveRange = (ref: ChartFormulaRangeReference, data: WorkSheet) => {
  const result = [];
  const rowStart = Math.min(ref.s.r, ref.e.r);
  const rowEnd = Math.max(ref.s.r, ref.e.r);
  const colStart = Math.min(ref.s.c, ref.e.c);
  const colEnd = Math.min(ref.s.c, ref.e.c);
  for (let i = rowStart; i <= rowEnd; i++) {
    for (let j = colStart; j <= colEnd; j++) {
      const val = resolvePoint({ r: i, c: j }, data);
      result.push(val);
    }
  }
  return result;
};

const resolveFormulas = (formulas: FormulaField, data: WorkSheet) => {
  if (!formulas || !Array.isArray(formulas)) {
    return [];
  }
  const result = formulas
    .map((f) => {
      if (f[0] === ChartFormulaType.POINT) {
        const pointRef = f[1][2];
        const val = resolvePoint(pointRef, data);
        return val;
      }
      if (f[0] === ChartFormulaType.RANGE) {
        const rangeRef = f[1][2];
        const vals = resolveRange(rangeRef, data);
        return vals;
      }
      return undefined;
    })
    .reduce((p, n) => p.concat(n), []);
  return result;
};

// TODO ts errors inside (s.label and s.categories possibly undefined)
const resolveChartRefs = (
  chartSeries: SeriesDefinition[],
  data: WorkSheet
) => {
  if (!chartSeries || !Array.isArray(chartSeries)) {
    return chartSeries;
  }
  const result = chartSeries.map((s) => {
    s = JSON.parse(JSON.stringify(s));
    try {
      if (!s.values.values && s.values.formula) {
        s.values.values = resolveFormulas(s.values.formula, data);
        delete s.values.formula;
      }
      // TODO: when an error will be catch, a chart placeholder should be shown (just as in the case of an unknown chart type)
      // eslint-disable-next-line no-empty
    } catch {
    }
    try {
      if (!s.label?.value && s.label?.formula) {
        const [resolvedFirstFormula] = resolveFormulas(s.label.formula, data);
        s.label.value = resolvedFirstFormula;
        delete s.label.formula;
      }
      // TODO: when an error will be catch, a chart placeholder should be shown (just as in the case of an unknown chart type)
      // eslint-disable-next-line no-empty
    } catch {
    }
    try {
      if (!s.categories?.values && s.categories?.formula) {
        s.categories.values = resolveFormulas(s.categories.formula, data);
        delete s.categories.formula;
      }
      // TODO: when an error will be catch, a chart placeholder should be shown (just as in the case of an unknown chart type)
      // eslint-disable-next-line no-empty
    } catch {
    }
    return s;
  });
  return result;
};

class ChartRenderer extends React.Component {
  componentDidMount() {
    // * this hack is need for Geom component of bizcharts to render first, before we can make visual testing. This hack fixes most of the cases where Geom doesn't render
    setTimeout(() => {
      decreaseLazyEmbedsCounter();
    }, 0);
  }

  render() {
    const { children } = this.props;

    return children;
  }
}

export const getChartRenderer = (embeddedObject: EmbeddedChart, tableData: WorkSheet): FloatingObjectRenderer => {
  const {
    chartSeries, chartOptions, chartType
  } = embeddedObject;
  let { chartTitle } = embeddedObject;
  if (!chartTitle) {
    chartTitle = DEFAULT_CHART_TITLE;
  }
  const resolvedSeries = resolveChartRefs(chartSeries, tableData);
  return function floatingBoxChartRenderer(
    container,
    width,
    height
  ) {
    container.classList.add('sv-handsontable-chart');
    const Renderer = chartByType[chartType] || Placeholder;
    if (typeof Renderer !== 'function') {
      decreaseLazyEmbedsCounter();
      return;
    }
    render(
      <ChartRenderer>
        <Renderer width={width} height={height} chartSeries={resolvedSeries} chartOptions={chartOptions} name={chartTitle || ''} />
      </ChartRenderer>,
      container
    );
  };
};
