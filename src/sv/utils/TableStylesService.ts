import type { WorkSheet, SVTable } from '@handsontable/js-xlsx';

import { getStyleFragmentsFromName } from './tableDesign/BuiltInTableStyles';
import {
  CellAddress,
  BuiltInTableStylesFragments,
  TableAddress,
  TableConfig,
  TableFragmentAddressChecker,
  TableStyleFragments
} from '../entities/SpreadsheetTableStyle';
import { SpreadsheetStyle } from '../entities/SpreadsheetStyle';
import { SJS_TABLES } from '../entities/SpreadsheetJsonKeys';
import { svCellObject } from './FileService';
import { spreadsheetColumnLabel, spreadsheetColumnIndex } from './SpreadsheetService';
import { getPropertyOrUndefined } from './has-own-property';

const tableFragmentsCheckers: Record<BuiltInTableStylesFragments, TableFragmentAddressChecker> = {
  evenRow: (cellAddress, tableConfig) => !tableConfig.showRowStripes
    || !tableFragmentsCheckers.header(cellAddress, tableConfig)
    && !tableFragmentsCheckers.averageRow(cellAddress, tableConfig)
    && !((cellAddress.row + ((tableConfig.address.startCell.row + 1) % 2) + tableConfig.headerRowCount) % 2),
  oddRow: (cellAddress, tableConfig) => tableConfig.showRowStripes
    && !tableFragmentsCheckers.header(cellAddress, tableConfig)
    && !tableFragmentsCheckers.averageRow(cellAddress, tableConfig)
    && !tableFragmentsCheckers.evenRow(cellAddress, tableConfig),
  header: (cellAddress, { address, headerRowCount }) => headerRowCount ? cellAddress.row < (address.startCell.row + headerRowCount) : false, // eslint-disable-line no-confusing-arrow
  firstColumn: (cellAddress, { address }) => cellAddress.column === address.startCell.column,
  lastColumn: (cellAddress, { address }) => cellAddress.column === address.endCell.column,
  averageRow: (cellAddress, { address, totalsRowCount }) => totalsRowCount ? (cellAddress.row > (address.endCell.row - totalsRowCount)) : false, // eslint-disable-line no-confusing-arrow
  showFirstColumn: (cellAddress, tableConfig) => tableConfig.showFirstColumn
    && tableFragmentsCheckers.firstColumn(cellAddress, tableConfig),
  showLastColumn: (cellAddress, tableConfig) => tableConfig.showLastColumn
    && tableFragmentsCheckers.lastColumn(cellAddress, tableConfig),
  oddColumn: (cellAddress, tableConfig) => tableConfig.showColumnStripes
    && !tableFragmentsCheckers.header(cellAddress, tableConfig)
    && !tableFragmentsCheckers.averageRow(cellAddress, tableConfig)
    && !!((spreadsheetColumnIndex(cellAddress.column) - spreadsheetColumnIndex(tableConfig.address.endCell.column)) % 2),
  firstRow: (cellAddress, { address, headerRowCount }) => headerRowCount // eslint-disable-line no-confusing-arrow
    ? (cellAddress.row === (address.startCell.row + headerRowCount))
    : cellAddress.row === address.startCell.row,
  lastRow: (cellAddress, { address, totalsRowCount }) => totalsRowCount // eslint-disable-line no-confusing-arrow
    ? (cellAddress.row === (address.endCell.row - totalsRowCount))
    : cellAddress.row === address.endCell.row,
  table: () => true
};
const parseRawCellAddress = (rawCellAddress: string): CellAddress => {
  // Example match result: [A1, A, 1], thats why slice(-2) is needed.
  const result = rawCellAddress.match(/([A-Z]+)([0-9]+)/);
  if (result === null) {
    return {
      row: 0,
      column: '0'
    };
  }

  const [column, row] = result.slice(-2);

  return ({
    row: Number(row),
    column
  });
};

const buildRawCellAddress = (cellAddress: CellAddress): string => `${cellAddress.column}${cellAddress.row}`;

const getTableCellsAddresses = (tableAddress: TableAddress): CellAddress[] => {
  const startColumn = spreadsheetColumnIndex(tableAddress.startCell.column);
  const endColumn = spreadsheetColumnIndex(tableAddress.endCell.column);
  const startRow = tableAddress.startCell.row;
  const endRow = tableAddress.endCell.row;
  const cellAdressess: CellAddress[] = [];

  for (let currentColumn = startColumn; currentColumn <= endColumn; currentColumn++) {
    for (let currentRow = startRow; currentRow <= endRow; currentRow++) {
      cellAdressess.push({
        column: spreadsheetColumnLabel(currentColumn),
        row: currentRow
      });
    }
  }

  return cellAdressess;
};

const getSpreadsheetStyleFromStyleFragments = (tableConfig: TableConfig, cellAddress: CellAddress, styleFragments: TableStyleFragments): SpreadsheetStyle => {
  return Object.entries(styleFragments).reduce<SpreadsheetStyle>((cellStyle, [fragmentName, tableFragmentStyles]) => {
    const fragmentChecker = getPropertyOrUndefined(tableFragmentsCheckers, fragmentName);

    if (fragmentChecker && fragmentChecker(cellAddress, tableConfig)) {
      const newCellStyle = {
        ...tableFragmentStyles,
        ...cellStyle,
      };
      // Merge individual properties of border instead of overriding whole border.
      if (newCellStyle.border) {
        newCellStyle.border = {
          ...(tableFragmentStyles?.border ? tableFragmentStyles.border : {}),
          ...(cellStyle?.border ? cellStyle.border : {}),
        };
      }

      return newCellStyle;
    }

    return cellStyle;
  }, {});
};

const applyTableStylesToSheetCells = (sheet: WorkSheet, tableConfig: TableConfig, tableCells: CellAddress[], styleFragments: TableStyleFragments): void => {
  tableCells.forEach((cellAddress) => {
    const rawCellAddress = buildRawCellAddress(cellAddress);
    let cellObject: svCellObject = sheet[rawCellAddress];

    if (!cellObject) {
      cellObject = { s: {}, isTextContent: false, t: 'n' };
      sheet[rawCellAddress] = cellObject;
    }

    const cellTableStyles = getSpreadsheetStyleFromStyleFragments(tableConfig, cellAddress, styleFragments);
    const color = cellObject.s.color === '#000000' ? cellTableStyles.color : cellObject.s.color;

    cellObject.s = { ...cellTableStyles, ...cellObject.s, color };

  });
};

const parseTableAddress = (rawTableAddress: string): TableAddress => {
  const [startCell, endCell] = rawTableAddress.split(':');

  return ({
    startCell: parseRawCellAddress(startCell),
    endCell: parseRawCellAddress(endCell)
  });
};

const parseTableConfig = (table: SVTable): TableConfig => {
  const {
    ref, headerRowCount, totalsRowCount, style
  } = table;
  const address = parseTableAddress(ref);

  return ({
    showFirstColumn: Boolean(style?.showFirstColumn),
    showLastColumn: Boolean(style?.showLastColumn),
    showRowStripes: Boolean(style?.showRowStripes),
    showColumnStripes: Boolean(style?.showColumnStripes),
    address,
    headerRowCount,
    totalsRowCount,
  });
};

export const applyTablesStylesToCells = (sheet: WorkSheet): void => {
  const sheetTables: SVTable[] = sheet[SJS_TABLES];

  sheetTables.forEach((table) => {
    if (!table.style) {
      return;
    }

    const tableConfig = parseTableConfig(table);
    const tableCells = getTableCellsAddresses(tableConfig.address);
    const styleFragments = getStyleFragmentsFromName(table.style.name);

    applyTableStylesToSheetCells(sheet, tableConfig, tableCells, styleFragments);
  });
};
