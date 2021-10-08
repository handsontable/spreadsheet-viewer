import { ChartOptions, SeriesDefinition } from '../../Charts/abstracts';
import type { ChartType } from '../../Charts';

export enum EmbeddedObjectType {
  CHART = 'chart',
  IMAGE = 'image'
}

type AnchorData = {
  dxL: string;
  colR: string;
  rwB: string;
  rwT: string;
  colL: string;
  dyT: string;
  dxR: string;
  dyB: string;
};
type EmbeddedObjectCommon = {
  anchor: AnchorData;
};

export type EmbeddedObject = EmbeddedChart | EmbeddedImage;

export type EmbeddedChart = EmbeddedObjectCommon & {
  type: EmbeddedObjectType.CHART;
  chartSeries: SeriesDefinition[];
  chartOptions: ChartOptions;
  chartType: ChartType;
  chartTitle?: string;
};

export type EmbeddedImage = EmbeddedObjectCommon & {
  type: EmbeddedObjectType.IMAGE;
  imageData: string;
};
