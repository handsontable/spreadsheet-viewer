import React from 'react';
import DataSet from '@antv/data-set';
import {
  Chart, Geom, Axis, Tooltip, Legend, Coord
} from 'bizcharts';
import { animationConfig, chartSeriesToData } from './utils';
import { ChartRenderer } from '../abstracts';

export const PieChart: ChartRenderer = ({
  chartSeries, name, width, height
}) => {
  const chartInfo = chartSeriesToData(chartSeries);
  const dv = new DataSet.View().source(chartInfo.data);
  dv.transform({
    type: 'fold',
    fields: chartInfo.series,
    key: 'type',
    value: 'value'
  });
  dv.transform({
    type: 'percent',
    dimension: 'type',
    field: 'value',
    groupBy: ['key'],
    as: 'value'
  });
  const getOnlyFirst = true;
  let color = 'type';
  if (getOnlyFirst) {
    const firstDimension = Object.keys(chartInfo.data[0])[0];
    dv.transform({
      type: 'filter',
      callback: r => r.type === firstDimension
    });
    color = 'key';
  }

  return (
    <Chart height={height} width={width} data={dv} padding="auto">
      <span className="sv-chart-title">{name}</span>
      <Tooltip crosshairs />
      <Axis />
      <Legend />
      <Coord type="theta" radius={0.65} />
      <Geom
        type="intervalStack"
        position="value"
        color={color}
        shape="smooth"
        tooltip={[
          'key*value*type',
          (key, value, type) => ({
            name: `${type}:${key}`,
            value: `${((value * 10000) | 0) / 100}%`
          })
        ]}
        animate={animationConfig}
      />
    </Chart>
  );
};
