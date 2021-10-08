import React from 'react';
import DataSet from '@antv/data-set';
import {
  Chart, Geom, Axis, Tooltip, Legend
} from 'bizcharts';
import { animationConfig, chartSeriesToData } from './utils';
import type { ChartRenderer } from '../abstracts';

export const AreaChart: ChartRenderer = ({
  chartSeries,
  chartOptions,
  name,
  width,
  height
}) => {
  const chartInfo = chartSeriesToData(chartSeries);
  const dv = new DataSet.View().source(chartInfo.data);
  dv.transform({
    type: 'fold',
    fields: chartInfo.series,
    key: 'type',
    value: 'value'
  });
  if (chartOptions.flags.f100) {
    dv.transform({
      type: 'percent',
      dimension: 'type',
      field: 'value',
      groupBy: ['key'],
      as: 'value'
    });
  }
  const adjust = chartOptions.flags.fStacked ? 'stack' : '';

  const colors = chartSeries
    .map(s => s.format?.area?.rgbFore)
    .filter((s): s is string => typeof s === 'string');

  const colorProp: [string, string[] | undefined] = colors.length > 0 ? ['type', colors] : ['type', undefined];

  return (
    <Chart height={height} width={width} data={dv} padding="auto">
      <span className="sv-chart-title">{name}</span>
      <Tooltip crosshairs />
      <Axis />
      <Legend />
      <Geom
        type="area"
        adjust={adjust}
        position="key*value"
        // @ts-ignore
        color={colorProp}
        shape="smooth"
        size={2}
        animate={animationConfig}
      />
    </Chart>
  );
};
