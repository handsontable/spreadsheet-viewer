export enum ChartFormulaType {
  RANGE = 'PtgArea3d',
  POINT = 'PtgRef3d'
}

export type ChartFormulaPointReference = {
  r: number;
  c: number;
};

export type ChartFormulaRangeReference = {
  s: ChartFormulaPointReference;
  e: ChartFormulaPointReference;
};

type ChartPointRefFormula = [
  ChartFormulaType.POINT,
  [1, 5, ChartFormulaPointReference]
];
type ChartRangeRefFormula = [
  ChartFormulaType.RANGE,
  [1, 6, ChartFormulaRangeReference]
];

export type FormulaField = Array<ChartPointRefFormula | ChartRangeRefFormula>;

type ChartSeriesProp = {
  values?: Array<string | number>;
  formula?: FormulaField;
};
type ChartLabelDef = {
  value: string | number;
  formula?: ChartPointRefFormula[];
};

type LineFormat = {
  rgb: string;
};

type AreaFormat = {
  rgbFore: string;
  rgbBack: string;
};

type SeriesFormat = {
  line: LineFormat;
  area: AreaFormat;
};

type ChartFlags = {
  fStacked: boolean;
  f100: boolean;
  fTranspose: boolean;
};

export type MarkerFormatDefinition = {
  imk: number;
  size?: string;
  fNotShowBrd?: boolean;
  rgbFore?: string;
  fNotShowInt?: boolean;
  rgbBack?: string;
};

export type SeriesDefinition = {
  categories?: ChartSeriesProp;
  values: ChartSeriesProp;
  label?: ChartLabelDef;
  format?: SeriesFormat;
  markerFormat: MarkerFormatDefinition;
};

export type ChartOptions = {
  flags: ChartFlags;
};

export type ChartRendererProps = {
  chartSeries: SeriesDefinition[]
  chartOptions: ChartOptions
  name: string
  width: number
  height: number
};

export type ChartRenderer = React.FC<ChartRendererProps>;
