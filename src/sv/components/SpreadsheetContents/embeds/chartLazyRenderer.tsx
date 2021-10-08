import type { WorkSheet } from '@handsontable/js-xlsx';
import { EmbeddedChart } from './abstracts';
import { increaseLazyEmbedsCounter } from './lazyEmbedsCounter';
import { FloatingObjectRenderer } from '../FloatingBoxPlugin';

export const getChartLazyRenderer = (embeddedObject: EmbeddedChart, tableData: WorkSheet): FloatingObjectRenderer => {
  return function floatingBoxChartRenderer(container, width, height) {
    increaseLazyEmbedsCounter();
    (async() => {
      const chart = await import(/* webpackChunkName: "embedsChartRenderer" */ './chartRenderer');
      const renderer = chart.getChartRenderer(embeddedObject, tableData);
      renderer(container, width, height);
    })();
  };
};
