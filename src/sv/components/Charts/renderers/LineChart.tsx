import React, { FC } from 'react';
import DataSet from '@antv/data-set';
import {
  Chart, Geom, Axis, Tooltip, Legend
} from 'bizcharts';
import {
  chartSeriesToData,
  MarkerComponentFlag,
  animationConfig
} from './utils';
import { MarkerComponent, ImkField, MarkerColorField } from './MarkerComponent';
import { ChartRenderer } from '../abstracts';

// import G2 from '@antv/g2';
// console.log(Object.entries(G2.Shape.Point).filter(([k, v]) => typeof v === 'object'));

export const LineChart: ChartRenderer = ({
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
    .map(s => s.format?.line?.rgb)
    .filter((s): s is string => typeof s === 'string');

  const colorProp: [string, string[] | undefined] = colors.length > 0 ? ['type', colors] : ['type', undefined];

  return (
    <Chart height={height} width={width} data={dv} padding="auto" animate={false}>
      <span className="sv-chart-title">{name}</span>
      <Tooltip crosshairs g2-tooltip={{ display: 'inline-flex' }} />
      <Axis />
      <Legend />
      <Geom
        type="line"
        adjust={adjust}
        position="key*value"
        // @ts-ignore
        color={colorProp}
        shape="smooth"
        size={2}
        animate={animationConfig}
      />
      <MarkerComponent
        chartSeries={chartSeries}
        componentFlag={MarkerComponentFlag.MARKER_COMPONENT_FRONT}
        imkComponent={ImkField.FIELD_FRONT}
        adjust={adjust}
        colorField={MarkerColorField.FIELD_FRONT}
      />
      <MarkerComponent
        chartSeries={chartSeries}
        componentFlag={MarkerComponentFlag.MARKER_COMPONENT_BACK}
        imkComponent={ImkField.FIELD_BACK}
        adjust={adjust}
        colorField={MarkerColorField.FIELD_BACK}
      />
    </Chart>
  );
};
