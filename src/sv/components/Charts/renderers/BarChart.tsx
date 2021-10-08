import React from 'react';
import DataSet from '@antv/data-set';
import {
  Chart, Geom, Axis, Tooltip, Legend, Coord
} from 'bizcharts';
import { animationConfig, chartSeriesToData } from './utils';
import { ChartRenderer } from '../abstracts';

export const BarChart: ChartRenderer = ({
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
  const barType = chartOptions.flags.fStacked ? 'intervalStack' : 'interval';
  const coord = chartOptions.flags.fTranspose ? (
    <Coord transpose scale={[1, -1]} />
  ) : (
    <Coord scale={[1, 1]} />
  );

  const colors = chartSeries
    .map(s => s.format?.area?.rgbFore)
    .filter((s): s is string => typeof s === 'string');

  const colorProp: [string, string[] | undefined] = colors.length > 0 ? ['type', colors] : ['type', undefined];

  return (
    <Chart height={height} width={width} data={dv} padding="auto">
      <span className="sv-chart-title">{name}</span>
      <Tooltip crosshairs />
      {coord}
      <Axis />
      <Legend />
      <Geom
        type={barType}
        position="key*value"
        // @ts-ignore
        color={colorProp}
        shape="smooth"
        adjust={[
          {
            type: 'dodge',
            marginRatio: 4 / 32
          }
        ]}
        animate={animationConfig}
      />
    </Chart>
  );
};
