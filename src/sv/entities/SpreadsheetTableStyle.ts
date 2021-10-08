import { SpreadsheetStyle } from './SpreadsheetStyle';

export type LightTableStyles = 'TableStyleLight1' | 'TableStyleLight2' | 'TableStyleLight3' | 'TableStyleLight4'
| 'TableStyleLight5' | 'TableStyleLight6' | 'TableStyleLight7' | 'TableStyleLight8'
| 'TableStyleLight9' | 'TableStyleLight10' | 'TableStyleLight11' | 'TableStyleLight12' | 'TableStyleLight13'
| 'TableStyleLight14' | 'TableStyleLight15' | 'TableStyleLight16' | 'TableStyleLight17' | 'TableStyleLight18'
| 'TableStyleLight19' | 'TableStyleLight20' | 'TableStyleLight21';

export type MediumTableStyles = 'TableStyleMedium1' | 'TableStyleMedium2' | 'TableStyleMedium3' | 'TableStyleMedium4'
| 'TableStyleMedium5' | 'TableStyleMedium6' | 'TableStyleMedium7'| 'TableStyleMedium8' | 'TableStyleMedium9'
| 'TableStyleMedium10' | 'TableStyleMedium11' | 'TableStyleMedium12' | 'TableStyleMedium13' | 'TableStyleMedium14'
| 'TableStyleMedium15' | 'TableStyleMedium16' | 'TableStyleMedium17' | 'TableStyleMedium18' | 'TableStyleMedium19'
| 'TableStyleMedium20' | 'TableStyleMedium21' | 'TableStyleMedium22' | 'TableStyleMedium23' | 'TableStyleMedium24'
| 'TableStyleMedium25' | 'TableStyleMedium26' | 'TableStyleMedium27' | 'TableStyleMedium28';

export type DarkTableStyles = | 'TableStyleDark1' | 'TableStyleDark2' | 'TableStyleDark3' | 'TableStyleDark4'
| 'TableStyleDark5' | 'TableStyleDark6' | 'TableStyleDark7' | 'TableStyleDark8' | 'TableStyleDark9' |
'TableStyleDark10' | 'TableStyleDark11';

export type BuiltInTableStyles = LightTableStyles | MediumTableStyles | DarkTableStyles;

export type BuiltInTableStylesFragments = 'header' | 'oddRow' | 'evenRow' | 'firstColumn' | 'lastColumn' | 'oddColumn' | 'showFirstColumn' | 'showLastColumn'
| 'averageRow' | 'table' | 'lastRow' | 'firstRow';

export interface CellAddress {
  column: string;
  row: number;
}

export interface TableAddress {
  startCell: CellAddress;
  endCell: CellAddress;
}

export interface TableConfig {
  address: TableAddress;
  headerRowCount: number;
  totalsRowCount: number;
  showFirstColumn: boolean;
  showLastColumn: boolean;
  showRowStripes: boolean;
  showColumnStripes: boolean;
}

export type TableFragmentAddressChecker = (cellAddress: CellAddress, tableConfig: TableConfig) => boolean;

export type TableStyleFragments = Partial<Record<BuiltInTableStylesFragments, SpreadsheetStyle>>;
