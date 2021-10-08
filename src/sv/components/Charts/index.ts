import { LineChart } from './renderers/LineChart';
import { AreaChart } from './renderers/AreaChart';
import { BarChart } from './renderers/BarChart';
import { PieChart } from './renderers/PieChart';

// TODO lack of types
export const chartByType = {
  Line: LineChart,
  Bar: BarChart,
  Bar3D: BarChart,
  Line3D: LineChart,
  Area: AreaChart,
  Area3D: AreaChart,
  Stock: undefined,
  Surface3D: undefined,
  Radar: undefined,
  Pie: PieChart,
  OfPie: undefined,
  Pie3D: PieChart,
  Doughnut: undefined,
  Scatter: undefined,
  Bubble: undefined,
  treemap: undefined,
  sunburst: undefined,
  regionMap: undefined,
  clusteredColumn: undefined,
  boxWhisker: undefined,
  waterfall: undefined,
  funnel: undefined,
};

export type ChartType = keyof typeof chartByType;
