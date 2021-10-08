import hot from 'handsontable';
import { WorkSheet, Range as XLSXRange } from '@handsontable/js-xlsx';
import { HotTableProps } from '@handsontable/react';
import type Handsontable from 'handsontable';
import type { svCellObject, svColInfo, svRowInfo } from '../../utils/FileService';
import { MARKERS, startPerfMarker } from '../../../../perf/markers';
import {
  SJS_COLS_KEY,
  SJS_DEFAULT_SIZES_KEY,
  SJS_MERGE_KEY,
  SJS_OBJECTS_KEY,
  SJS_ROWS_KEY,
  SJS_SHOWGRID_KEY,
  SJS_XSPLIT_KEY,
  SJS_YSPLIT_KEY
} from '../../entities/SpreadsheetJsonKeys';
import { IdToSpreadsheetStyleMap } from '../../entities/SpreadsheetStyleMap';
import { extendDesiredFontWithFallbacks } from './preloadFonts';
import {
  SpreadsheetStyle, BorderWidth, BorderStyle, BorderStyles
} from '../../entities/SpreadsheetStyle';
import { StringifiedCoords, stringifyCoords } from './HorizontalOverlapPlugin';
import { getObjectRenderer } from './embeds';
import { FloatingBoxSettings } from './FloatingBoxPlugin';
import { showCellGridlines } from './utils/gridlinesFormatting';
import { EmbeddedObject } from './embeds/abstracts';
import { detectMobileDevice } from '../../utils/detectMobile';
import { CURRENCY_SYMBOLS } from '../../entities/CurrencySymbols';

export const PATTERN_TYPE_SOLID = 'solid';
const CSS_CLASS_NOGRID = 'sv-hide-gridlines';

/** @link https://github.com/handsontable/spreadsheet-viewer-dev/wiki/Displayed-cell-range#grid-limits */
const LOWER_GRID_LIMIT_ROWS = 20;
const LOWER_GRID_LIMIT_COLUMNS = 6;
const UPPER_GRID_LIMIT_ROWS = 10000;
const UPPER_GRID_LIMIT_COLUMNS = 256;

const FALLBACK_COLOR = '000';
export const HORIZONTAL_PADDING_LEFT = 4;
export const HORIZONTAL_PADDING_RIGHT = 4;
export const INDENTATION_WIDTH = 9;
export const GRIDLINE_WIDTH = 1;

export const fullPageModeHotConfig = {
  viewportRowRenderingOffset: UPPER_GRID_LIMIT_ROWS, // force rendring of all rows
  viewportColumnRenderingOffset: UPPER_GRID_LIMIT_COLUMNS, // force rendring of all columns
};

/**
 * EMU - English Metric Units
 * This unit is necessary to calculate offsets for XLSX format
 * 1 px = 9525EMU
 * @link https://stackoverflow.com/questions/20194403/openxml-distance-size-units
 */
const EMU_UNIT = 9525;

/**
 * Count top left offset in X axis for floating box.
 * offsetUnit is `dxL`
 */
const countTopLeftOffsetX = (offsetUnit: number) => {
  return offsetUnit / EMU_UNIT;
};
/**
 * Count top left offset in Y axis for floating box.
 * offsetUnit is `dyT`
 */
const countTopLeftOffsetY = (offsetUnit: number) => {
  return offsetUnit / EMU_UNIT;
};
/**
 * Count bottom right offset in X axis for floating box.
 * offsetUnit is `dxR`
 */
const countBottomRightOffsetX = (offsetUnit: number, bottomColumnWidth: number) => {
  return (offsetUnit / EMU_UNIT) - bottomColumnWidth;
};
/**
 * Count bottom right offset in Y axis for floating box.
 * Bottom right offset Y should always be a negative number.
 *
 * offsetUnit is `dyB`
 */
const countBottomRightOffsetY = (offsetUnit: number, bottomRowHeight: number) => {
  const offset = (offsetUnit / EMU_UNIT) - bottomRowHeight;

  return -Math.round(Math.abs(offset));
};
interface CustomBordersConfig {
  row: number;
  col: number;
  left?: any;
  right?: any;
  top?: any;
  bottom?: any;
}

export interface HotTableProperties extends HotTableProps {
  // redefine HotTableProps types to be stricter
  columns: hot.ColumnSettings[];
  rowHeights: number[];
  colWidths: number[];
  mergeCells: hot.mergeCells.Settings[];
  customBorders: hot.customBorders.Settings[];
  selectionStyle: object; // TODO this must be added in handsontable.d.ts

  svMultiRowCells: Set<StringifiedCoords>;
  showGrid: boolean;
  floatingBox: FloatingBoxSettings[];
  horizontalOverlap: {
    startCells: Set<StringifiedCoords>; // start cells are all non-empty cells that are not merged
    stopCells: Set<StringifiedCoords>; // stop cells can include: merge cells, non-empty cells and other cells listed in https://github.com/handsontable/spreadsheet-viewer-demo/wiki/Horizontal-Overlapping
    styleMap: IdToSpreadsheetStyleMap;
    overlapStartCells: Map<StringifiedCoords, {
      left: string,
      width: string,
      height: string
    }>;
    hideRightGridlineTds: Set<StringifiedCoords>,
    obscuredNonText: Map<StringifiedCoords, string>
  }
  rowClassNames: Map<number, string>;
  columnClassNames: Map<number, string>;
}

enum NumberFormatsEnum {
  General = 'general',
  Accounting = 'accounting',
  Currency = 'currency'
}

type NumberFormats = NumberFormatsEnum.General | NumberFormatsEnum.Currency | NumberFormatsEnum.Accounting;

export interface HotCellProperties extends Handsontable.CellProperties {
  cellClassName?: string;
  isTextContent: boolean;
  numberFormat?: {
    format: NumberFormatsEnum,
    currencySymbol?: typeof CURRENCY_SYMBOLS[number],
    currencyValue?: string
  };
}

function beforeInit() {
  startPerfMarker(MARKERS.presentationHotRendering);
}

function afterInit(this: Handsontable) {
  const options = this.getSettings() as HotTableProperties;
  if (!options.showGrid) {
    this.rootElement.classList.add(CSS_CLASS_NOGRID);
  }
}

/**
 * Converts font-weight keyword to number. If font-weight is not normalized, web font preload cache
 * infinitely waits for "bold" even if it already has "700"
 */
function normalizeFontWeight(weight: string | number | undefined): number {
  if (typeof weight === 'number') {
    return weight;
  }

  const defaultWeight = 400;

  if (weight === undefined) {
    return defaultWeight;
  }

  const parsedWeight = parseInt(weight, 10);

  if (parsedWeight) {
    return parsedWeight;
  }

  if (weight === 'bold') {
    return 700;
  }

  return defaultWeight;
}

const STYLE_CSS_FIELDS_TO_COPY = [
  'color',
  'fontSize',
  'lineHeight',
  'textDecoration',
  'textShadow',
  'overflow',
  'textAlign',
  'verticalAlign',
  'direction',
  'wordBreak',
  'whiteSpace',
  'display'
] as const;

type CSS_PROPERTY_KEY =
| 'backgroundColor'
| 'fontFamily'
| 'fontStyle'
| 'borderRightColor'
| 'borderBottomColor'
| 'fontFamily'
| 'fontStyle'
| 'fontWeight'
| typeof STYLE_CSS_FIELDS_TO_COPY[number];

type CSSProperties = Partial<Record<CSS_PROPERTY_KEY, string|number>>;

const sjsStyleToCSS = (style: SpreadsheetStyle): CSSProperties => {
  const isSolidPatternType = style.patternType === PATTERN_TYPE_SOLID;

  const result: CSSProperties = {
    backgroundColor: isSolidPatternType && style.fgColor ? `#${style.fgColor.rgb}` : '',
    fontFamily: style.fontFamily ?? '',
    fontStyle: style.fontStyle ?? '',
    borderRightColor: (isSolidPatternType && !showCellGridlines(style.border)) ? 'transparent' : '',
    borderBottomColor: (isSolidPatternType && !showCellGridlines(style.border)) ? 'transparent' : '',
    ...style.fontFamily ? (() => {
      const fontWeight = normalizeFontWeight(style.fontWeight || 400);
      const fontStyle = style.fontStyle ?? 'normal';

      return {
        fontWeight,
        fontStyle,
        fontFamily: extendDesiredFontWithFallbacks(style.fontFamily, fontWeight, fontStyle)
      };
    })() : {}
  };

  STYLE_CSS_FIELDS_TO_COPY.forEach((field) => {
    if (!style[field]) {
      return;
    }
    result[field] = style[field];
  });

  return result;
};

interface MergedCells {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
  mergedColumn: boolean;
  mergedRow: boolean;
}

export const sjsMergeToHot = ({ s, e }: XLSXRange): MergedCells => {
  let rowspan = e.r - s.r;
  let colspan = e.c - s.c;

  if (rowspan >= 0) {
    rowspan += 1;
  }
  if (colspan >= 0) {
    colspan += 1;
  }

  return {
    row: s.r,
    col: s.c,
    rowspan,
    colspan,
    mergedColumn: rowspan > UPPER_GRID_LIMIT_ROWS,
    mergedRow: colspan > UPPER_GRID_LIMIT_COLUMNS
  };
};

const createCellStructure = (td: HTMLTableCellElement) => {
  const outer = document.createElement('div');
  const innerCurrency = document.createElement('div');
  innerCurrency.className = 'sv-cell-text-wrapper__currency';
  const innerMain = document.createElement('div');
  innerMain.className = 'sv-cell-text-wrapper__value';
  outer.appendChild(innerCurrency);
  outer.appendChild(innerMain);
  td.appendChild(outer);
};

/**
 * Check if "accounting" number format should be applied to a cell
 */
function isFormattedAccountingCell(numberFormat: HotCellProperties['numberFormat']) {
  return (numberFormat?.format === NumberFormatsEnum.Accounting
    && numberFormat.currencySymbol
    && numberFormat.currencyValue
  );
}

function styleRenderer(
  this: Handsontable.CellProperties,
  instance: Handsontable,
  td: HTMLTableCellElement,
  row: number, col: number,
  prop: string | number,
  value: Handsontable.CellValue,
  cellProperties: Handsontable.CellProperties
) {
  if (!td.firstElementChild) {
    createCellStructure(td);
  }
  const cellTextWrapper: HTMLDivElement = td.firstElementChild as HTMLDivElement;
  const currencyTextElement: HTMLSpanElement = cellTextWrapper?.firstElementChild as HTMLSpanElement;
  const mainTextElement: HTMLSpanElement = cellTextWrapper?.lastElementChild as HTMLSpanElement;
  cellTextWrapper.removeAttribute('style');
  cellTextWrapper.className = 'sv-cell-text-wrapper';

  const coords = stringifyCoords(row, col);
  if (!cellProperties.svMultiRowCells.has(coords)) {
    if (Array.isArray(cellProperties.rowHeights)) {
      const rowHeight = cellProperties.rowHeights[row];
      const availableHeight = Number(rowHeight) - GRIDLINE_WIDTH;
      const { styleMap } = cellProperties.horizontalOverlap;
      cellTextWrapper.style.maxHeight = `${availableHeight}px`;
      if (cellProperties.cellClassName) {
        const styleForCell = styleMap[cellProperties.cellClassName];
        const { lineHeight } = styleForCell;
        if (lineHeight) {
          const lineHeightInPx = parseInt(lineHeight, 10);
          cellTextWrapper.style.lineHeight = `${Math.min(availableHeight, lineHeightInPx)}px `;
        }
      }
    }
  }

  const obscuredNonTextValue = cellProperties.horizontalOverlap.obscuredNonText.get(coords);
  const { numberFormat } = cellProperties;
  const isAccounting = isFormattedAccountingCell(cellProperties.numberFormat);

  if (isAccounting && !obscuredNonTextValue) {
    cellTextWrapper.classList.add('sv-cell-text-wrapper--accounting');
    hot.dom.fastInnerText(currencyTextElement, ` ${numberFormat.currencySymbol} `);
    hot.dom.fastInnerText(mainTextElement, numberFormat.currencyValue);
  } else {
    hot.dom.fastInnerText(mainTextElement, obscuredNonTextValue || value || '');
  }

  const rowClassName = cellProperties.rowClassNames.get(row);
  if (rowClassName) {
    td.classList.add(rowClassName);
  }
  const columnClassName = cellProperties.columnClassNames.get(col);
  if (columnClassName) {
    td.classList.add(columnClassName);
  }
  if (cellProperties.cellClassName) {
    td.classList.add(cellProperties.cellClassName);
  }

  const { horizontalOverlap } = cellProperties;
  const styleProps = horizontalOverlap.overlapStartCells.get(coords);
  if (styleProps) {
    cellTextWrapper.classList.add('sv-handsontable-horizontal-overlay');
    Object.assign(cellTextWrapper.style, styleProps);
  }
  if (horizontalOverlap.hideRightGridlineTds.has(coords)) {
    td.classList.add('sv-handsontable-hide-right-gridline');
  }

  return td;
}

type TableViewData = {
  tableProps?: HotTableProps;
};

function parseBorderWidth(widthDesc: BorderWidth): number {
  if (widthDesc === 'thin') {
    return 1;
  }
  if (widthDesc === 'medium') {
    return 2;
  }
  if (widthDesc === 'thick') {
    return 3;
  }
  return 1;
}

const defineCustomBorder = (styleObjBorder: BorderStyles, row: number, col: number): CustomBordersConfig => {
  const customBorderDef: CustomBordersConfig = {
    row,
    col
  };

  const directions = ['left', 'right', 'bottom', 'top'] as const;
  directions.forEach((direction) => {
  // `direction` has one of the following values: left|right|bottom|top
    const borderObj = styleObjBorder[direction];

    if (borderObj?.width) {
      customBorderDef[direction] = {
        width: parseBorderWidth(borderObj.width),
        color: `#${borderObj.color || FALLBACK_COLOR}`
      };
    }
  });
  return customBorderDef;
};

const getNumberFormat = (cellValue: svCellObject['w'], format: svCellObject['z'], type: svCellObject['t']): NumberFormats => {
  if (!cellValue || format === 'General') {
    return NumberFormatsEnum.General;
  }

  const hasWhiteSpaces = cellValue.trim() !== cellValue;
  // if the cell value has white spaces at the beginning or at the end, that means it's a "accounting" formatting
  if (type === 'n' && hasWhiteSpaces) {
    return NumberFormatsEnum.Accounting;
  }
  if (type === 'n' && !hasWhiteSpaces) {
    return NumberFormatsEnum.Currency;
  }

  return NumberFormatsEnum.General;
};

type CurrencySymbolAndValue = {
  currencyValue: string,
  currencySymbol: typeof CURRENCY_SYMBOLS[number],
};

const splitAtIndex = (str: string, index: number) => {
  return [str.substring(0, index), str.substring(index)];
};

const getCurrencySymbolAndValue = (cellValue: svCellObject['w'], numberFormat: NumberFormats): undefined | CurrencySymbolAndValue => {
  if (numberFormat !== NumberFormatsEnum.Accounting || !cellValue) {
    return;
  }

  const numPosition = cellValue.search(/[-\\(0-9]/);
  if (numPosition > 0) {
    const [currencySymbolWithPadding, currencyValue] = splitAtIndex(cellValue, numPosition);
    const currencySymbol = currencySymbolWithPadding.trim() as typeof CURRENCY_SYMBOLS[number];
    if (CURRENCY_SYMBOLS.includes(currencySymbol)) {
      return { currencySymbol, currencyValue };
    }
  }
};

/**
 * Clamps number within the inclusive lower and upper bounds
 */
const clamp = (value: number, lower: number, upper: number) => Math.min(upper, Math.max(lower, value));

export const fromData = (
  tableData: WorkSheet,
  styleMap: IdToSpreadsheetStyleMap,
): TableViewData => {
  if (!tableData || tableData.hidden) {
    return {};
  }

  const cellCoords = new Map<string, svCellObject>();

  const tableProps: HotTableProperties = {
    data: [],
    cell: [],
    afterLoadData: beforeInit, // beforeInit must be temporarily replaced with afterLoadData, see #35
    afterInit,
    // autoRowSize: 0,
    readOnly: true,
    colHeaders: true,
    rowHeaders: true,
    licenseKey: 'non-commercial-and-evaluation',
    showGrid: true,
    cells: () => ({ renderer: styleRenderer }),
    beforePaste: () => false,
    columns: [],
    mergeCells: [],
    colWidths: [],
    rowHeights: [],
    // hiddenRows: {
    //   rows: []
    // },
    // hiddenColumns: {
    //   columns: []
    // },
    fixedRowsTop: 0,
    fixedColumnsLeft: 0,
    fillHandle: false,
    customBorders: new Array<CustomBordersConfig>(),
    floatingBox: [],
    selectionMode: 'range' as HotTableProps['selectionMode'],
    selectionStyle: {
      cell: {
        borderWidth: 2,
        borderColor: 'rgb(16, 74, 204)'
      },
      area: {
        borderWidth: 1,
        borderColor: 'rgb(16, 74, 204)'
      }
    },
    horizontalOverlap: {
      startCells: new Set(), // start cells are all non-empty cells that are not merged
      stopCells: new Set(), // stop cells can include: merge cells, non-empty cells and other cells listed in https://github.com/handsontable/spreadsheet-viewer-demo/wiki/Horizontal-Overlapping
      styleMap,
      overlapStartCells: new Map(),
      hideRightGridlineTds: new Set(),
      obscuredNonText: new Map()
    },
    svMultiRowCells: new Set<StringifiedCoords>(), // cells that are merged vertically
    rowClassNames: new Map<number, string>(),
    columnClassNames: new Map<number, string>(),
    beforeInitWalkontable: (walkontableConfig) => {
      (walkontableConfig as any).externalRowCalculator = true; // this configuration option causes Handsontable/Walkontable to fully respect provided rowHeights. Without it, Handsontable performs an action called "markOversizedRows", which caused two problems: (1) undesired increase of to rowHeigths (part of the issue #335), (2) incorrect measurements of merged cells row height (issue #445)
    }
  };

  const defaultSizes = tableData[SJS_DEFAULT_SIZES_KEY];
  const defaultColumnWidth = defaultSizes.columns.wpx;
  const defaultRowHeight = defaultSizes.rows.hpx;

  let lastColumn = -1;
  let lastRow = -1;

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(tableData)) {
    switch (key) {
      case SJS_MERGE_KEY: {
        const val = value as XLSXRange[];
        val.forEach(({ s, e }) => { // eslint-disable-line no-loop-func
          const mergedCells = sjsMergeToHot({ s, e });
          tableProps.mergeCells.push(mergedCells);

          const isMergedColumnOrMergedRow = mergedCells.mergedColumn || mergedCells.mergedRow;
          const startCol = s.c;
          const startRow = s.r;
          const endCol = Math.min(UPPER_GRID_LIMIT_COLUMNS - 1, e.c);
          const endRow = Math.min(UPPER_GRID_LIMIT_ROWS - 1, e.r);

          if (endCol > lastColumn && !isMergedColumnOrMergedRow) {
            lastColumn = endCol;
          }
          if (endRow > lastRow && !isMergedColumnOrMergedRow) {
            lastRow = endRow;
          }

          if (startRow < endRow) {
            const coords = stringifyCoords(startRow, startCol);
            tableProps.svMultiRowCells.add(coords);
          }

          for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
              const coords = stringifyCoords(r, c);
              tableProps.horizontalOverlap.stopCells.add(coords);
              tableProps.horizontalOverlap.startCells.delete(coords);
            }
          }
        });
        break;
      }

      case SJS_COLS_KEY: {
        const val = value as svColInfo[];
        if (val.length > UPPER_GRID_LIMIT_COLUMNS) { // todo analyze: probably happen twice (once here, second on `fixupData()`
          val.length = UPPER_GRID_LIMIT_COLUMNS; // trim the array to the amount of columns that we can process within the hard limit
        }
        for (let columnIndex = 0; columnIndex < val.length; columnIndex++) { // can't use `map` because value is a sparse array
          // todo performance: here is performance optimization possibility for instance, if in coll 1000 is set fill then value has set only  for v.1000, iterating through all is unnecessary - here we should consider about getting keys of value or for of.
          const columnData = val[columnIndex];
          tableProps.colWidths[columnIndex] = columnData?.wpx || defaultColumnWidth;

          if (columnData?.svStyleId) {
            tableProps.columnClassNames.set(columnIndex, columnData.svStyleId);
          }
          if (columnData?.hidden) {
            // "hidden columns" are disabled until problem https://github.com/handsontable/handsontable/issues/5883 will be resolved and until Stage 2 in Spreadsheet Viewer roadmap
            // tableProps.hiddenColumns.columns.push(idx);

            if (tableProps.fixedColumnsLeft && tableProps.fixedColumnsLeft > 0 && columnIndex < tableProps.fixedColumnsLeft) {
              console.log('This sheet contains an unsupported hidden column inside a frozen pane. '
                + 'To avoid potentially incorrect rendering, we have disabled the frozen pane on the left.');
              tableProps.fixedColumnsLeft = 0;
            }
          }
        }
        break;
      }

      case SJS_ROWS_KEY: {
        const val = value as svRowInfo[];
        // todo performance: here is performance optimization possibility for instance, if in row 1000 is set fill then value has set only  for v.1000, iterating through all is unnecessary - here we should consider about getting keys of value or for of.
        if (val.length > UPPER_GRID_LIMIT_ROWS) {
          val.length = UPPER_GRID_LIMIT_ROWS; // trim the array to the amount of rows that we can process within the hard limit
        }
        for (let r = 0; r < val.length; r++) { // can't use `map` because value is a sparse array
          const row = val[r];
          const height = row?.hpx;
          tableProps.rowHeights[r] = height || defaultRowHeight;

          if (row?.svStyleId) {
            tableProps.rowClassNames.set(r, row.svStyleId);
          }
          if (row?.hidden) {
            // TODO "hidden rows" are disabled until Stage 2 in Spreadsheet Viewer roadmap
            // tableProps.hiddenRows.rows.push(idx);

            if (tableProps.fixedRowsTop && tableProps.fixedRowsTop > 0 && r < tableProps.fixedRowsTop) {
              console.log('This sheet contains an unsupported hidden row inside a frozen pane. '
                + 'To avoid potentially incorrect rendering, we have disabled the frozen pane on top.');
              tableProps.fixedRowsTop = 0;
            }
          }
        }
        break;
      }

      case SJS_XSPLIT_KEY:
        if (!detectMobileDevice()) {
          tableProps.fixedColumnsLeft = parseInt(value, 10);
        }
        break;

      case SJS_YSPLIT_KEY:
        if (!detectMobileDevice()) {
          tableProps.fixedRowsTop = parseInt(value, 10);
        }
        break;

      case SJS_SHOWGRID_KEY:
        if (value === false || value === 0) {
          tableProps.showGrid = false;
        }
        break;

      case SJS_OBJECTS_KEY: {
        const val = value as EmbeddedObject[];
        val.forEach((embeddedObject) => { // eslint-disable-line no-loop-func
          if (!embeddedObject || !embeddedObject.anchor || !embeddedObject.type) {
            console.warn('Skipping an embedded object of an unsupported type');
            return;
          }
          const { anchor } = embeddedObject;
          /**
           * Checks if we deal with .xls or .xlsx file.
           * In .xls file provided units are always smaller than EMU unit.
           *
           * This is my way to check the type of the file.
           */
          const isXlsFile = typeof anchor.dxL === 'number';
          const bottomRightColumn = parseInt(anchor.colR, 10);
          const bottomRightRow = parseInt(anchor.rwB, 10);
          const bottomColumnWidth: number = tableProps.colWidths[bottomRightColumn] === undefined
            ? defaultColumnWidth
            : tableProps.colWidths[bottomRightColumn];
          const bottomRowHeight: number = tableProps.rowHeights[bottomRightRow] === undefined
            ? defaultRowHeight
            : tableProps.rowHeights[bottomRightRow];
          const objectData: FloatingBoxSettings = {
            topLeftRow: parseInt(anchor.rwT, 10),
            topLeftColumn: parseInt(anchor.colL, 10),
            bottomRightColumn,
            bottomRightRow,
            // These two calculations are based on simple conversion EMU units to pixels + cells edges alignment (.xlsx)
            // In case of .xls file, the offsets are set to 0
            topLeftOffsetX: isXlsFile ? 0 : countTopLeftOffsetX(parseInt(anchor.dxL, 10)),
            topLeftOffsetY: isXlsFile ? 0 : countTopLeftOffsetY(parseInt(anchor.dyT, 10)),
            // These two calculations are based on conversion EMU units to pixels + cells edges alignment (.xlsx)
            // In case of .xls file, the offsets are set to 0
            bottomRightOffsetX: isXlsFile ? 0 : countBottomRightOffsetX(parseInt(anchor.dxR, 10), bottomColumnWidth),
            bottomRightOffsetY: isXlsFile ? 0 : countBottomRightOffsetY(parseInt(anchor.dyB, 10), bottomRowHeight),
            renderer: getObjectRenderer(embeddedObject, tableData)
          };
          tableProps.floatingBox.push(objectData);

          if (bottomRightColumn > lastColumn) {
            lastColumn = bottomRightColumn;
          }
          if (bottomRightRow > lastRow) {
            lastRow = bottomRightRow;
          }
        });
        break;
      }

      default:
        if (!value) {
          break;
        }

        {
          const matchKey = key.match(/^([a-zA-Z]+)([0-9]+)/);
          if (!matchKey || !matchKey[1] || !matchKey[2] || Number(matchKey[2]) > UPPER_GRID_LIMIT_ROWS) {
            break;
          }

          const rowIdx = Number(matchKey[2]) - 1;
          const colIdx = hot.helper.spreadsheetColumnIndex(matchKey[1]);

          if (colIdx + 1 > UPPER_GRID_LIMIT_COLUMNS) {
            break;
          }

          const cell = value as svCellObject;
          const row = (tableProps.data && tableProps.data[rowIdx]) ? tableProps.data[rowIdx] : [];
          let hasBorder = false;
          let shouldTruncateNewLines = false;
          if (cell.svStyleId) {
            const { border, wordBreak } = styleMap[cell.svStyleId];
            if (border) {
              hasBorder = true;
              const customBorderDef = defineCustomBorder(border, rowIdx, colIdx);
              tableProps.customBorders.push(customBorderDef);
            }
            shouldTruncateNewLines = wordBreak === undefined;
          }
          let processedValue = (cell.w || cell.v || '');
          if (shouldTruncateNewLines && typeof processedValue === 'string') {
            processedValue = processedValue.replace(/[\r\n]+/gm, '');
          }
          const hasProcessedValue = !!processedValue;
          if (hasProcessedValue || hasBorder) {
            (row as any)[colIdx] = processedValue;
            if (tableProps.data) {
              tableProps.data[rowIdx] = row; // only add the row to Handsontable if it has at least one not empty cell
            }
            if (colIdx > lastColumn) {
              lastColumn = colIdx;
            }
            if (rowIdx > lastRow) {
              lastRow = rowIdx;
            }

            if (hasProcessedValue) {
              const coords = stringifyCoords(rowIdx, colIdx);
              tableProps.horizontalOverlap.stopCells.add(coords);
              tableProps.horizontalOverlap.startCells.add(coords);
            }
          }

          const numberFormat = getNumberFormat(cell.w, cell.z, cell.t);
          const currencySymbolAndValue = getCurrencySymbolAndValue(cell.w, numberFormat);
          const outputStyle = {
            row: rowIdx,
            col: colIdx,
            cellClassName: cell.svStyleId,
            isTextContent: cell.isTextContent,
            numberFormat: {
              format: numberFormat,
              ...(currencySymbolAndValue && { ...currencySymbolAndValue })
            }
          };
          cellCoords.set(stringifyCoords(rowIdx, colIdx), cell);
          tableProps.cell?.push(outputStyle);
        }
        break;
    }
  }

  const totalCols = clamp(lastColumn + 1, LOWER_GRID_LIMIT_COLUMNS, UPPER_GRID_LIMIT_COLUMNS);
  const totalRows = clamp(lastRow + 1, LOWER_GRID_LIMIT_ROWS, UPPER_GRID_LIMIT_ROWS);

  tableProps.mergeCells = tableProps.mergeCells.map((mc) => {
    return {
      ...mc,
      rowspan: Math.min(totalRows - mc.row, mc.rowspan),
      colspan: Math.min(totalCols - mc.col, mc.colspan)
    };
  });

  if (tableProps.data) {
    if (tableProps.data.length > totalRows) {
      tableProps.data.splice(totalRows);
    } else if (tableProps.data.length < totalRows) {
      const oldLength = tableProps.data.length;
      tableProps.data.length = totalRows;
      tableProps.data.fill([], oldLength, totalRows);
    }
  }

  if (tableProps.rowHeights.length < totalRows) {
    const oldLength = tableProps.rowHeights.length;
    tableProps.rowHeights.length = totalRows;
    tableProps.rowHeights.fill(defaultRowHeight, oldLength, totalRows);
  }

  if (tableProps.colWidths.length < totalCols) {
    const oldLength = tableProps.colWidths.length;
    tableProps.colWidths.length = totalCols;
    tableProps.colWidths.fill(defaultColumnWidth, oldLength, totalCols);
  }

  // Iterate over every cell and give them border and fill styling even if the cells are empty (with no text)
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      // add border definitions for empty cells
      const row = tableProps.data?.[r];
      const value = row && (row as any)[c];
      const cell = cellCoords.get(stringifyCoords(r, c));

      if (value === undefined && !cell) {
        const columnClassName = tableProps.columnClassNames.get(c);
        if (columnClassName) { // TODO move this to `case SJS_COLS_KEY` and set custom border for the range of cells in a column
          const styleObj = styleMap[columnClassName];

          if (styleObj.border) {
            const customBorderDef = defineCustomBorder(styleObj.border, r, c);
            tableProps.customBorders.push(customBorderDef);
          }
        }

        const rowClassName = tableProps.rowClassNames.get(r);
        if (rowClassName) { // TODO move this to `case SJS_ROWS_KEY` and set custom border for the range of cells in a column
          const styleObj = styleMap[rowClassName];

          if (styleObj.border) {
            const customBorderDef = defineCustomBorder(styleObj.border, r, c);
            tableProps.customBorders.push(customBorderDef);
          }
        }
      }
    }
  }

  tableProps.columns.length = totalCols;

  return { tableProps };
};

// TODO: return an object, which will be serialized to CSS in one line at `cssMapToText`. See comment https://github.com/handsontable/spreadsheet-viewer-dev/pull/334#discussion_r408648719
const styleTextVertically = (styleObject: SpreadsheetStyle, className: string) => {
  let verticalPosition = '';
  switch (styleObject.verticalAlign) {
    case 'top':
      verticalPosition = `
        position: absolute;
        top: 0;
        align-items: flex-start;
      `;
      break;

    case 'bottom':
      verticalPosition = `
        position: absolute;
        bottom: 0;
        align-items: flex-end;
      `;
      break;

    default: // case 'middle'
      verticalPosition = `
        position: relative;
        align-items: center;
      `;
      break;
  }

  return `
    .handsontable td.${className} {
      position: relative;
    }
    .handsontable td.${className} .sv-cell-text-wrapper {
      display: flex;
      white-space: pre-wrap;
      ${verticalPosition}
    }
  `;
};

export const styleHorizontalTextVertically = (styleObject: SpreadsheetStyle, className: string) => {
  let verticalPosition = '';
  switch (styleObject.verticalAlign) {
    case 'top':
      verticalPosition = `
        align-items: flex-start;
      `;
      break;

    case 'bottom':
      verticalPosition = `
        align-items: flex-end;
      `;
      break;

    default: // case 'middle'
      verticalPosition = `
        align-items: center;
      `;
      break;
  }

  return `
    .handsontable td.${className} .sv-handsontable-horizontal-overlay {
      ${verticalPosition}
    }
  `;
};

// TODO: return an object, which will be serialized to CSS in one line at `cssMapToText`. See comment https://github.com/handsontable/spreadsheet-viewer-dev/pull/334#discussion_r408648719
const styleTextHorizontally = (styleObject: SpreadsheetStyle, className: string) => {
  switch (styleObject.textAlign) {
    case 'right':
      return `
      .handsontable td.${className} .sv-cell-text-wrapper {
        margin-right: ${HORIZONTAL_PADDING_RIGHT}px;
        justify-content: flex-end;
        }
    `;

    case 'center':
      return `
      .handsontable td.${className} .sv-cell-text-wrapper {
        justify-content: center;
        min-width: 100%;
        }
    `;

    default: // left
      return `
    .handsontable td.${className} .sv-cell-text-wrapper {
      margin-left: ${HORIZONTAL_PADDING_LEFT}px;
      justify-content: flex-start;
      }
  `;
  }
};

export const cssMapToText = (
  styleMap: IdToSpreadsheetStyleMap,
) => {
  // try {
  return Object.entries(styleMap)
    .map(([className, styleObject]) => {
      // const cssSheet = new CSSStyleSheet(); // Constructable Stylesheets are only available in Chrome (versions 73 and higher)
      const style = document.createElement('style');
      document.head.appendChild(style); // must append before you can access .sheet property
      const cssSheet = style.sheet as CSSStyleSheet;
      const specificity = className.includes('cell') ? 4 : 3;
      const selector = new Array(specificity).fill(`.${className}`).join('');
      cssSheet.insertRule(`${selector} {}`, 0); // second parameter required in IE11
      const cssRule = cssSheet.cssRules[0] as CSSStyleRule;
      const normalizedStyleObject = sjsStyleToCSS(styleObject);
      Object.assign(cssRule.style, normalizedStyleObject);
      Object.assign(styleObject, normalizedStyleObject);
      let result = cssRule.cssText;
      document.head.removeChild(style);

      // TODO perf: this function registers multiple styles for the same selector. It would be merged into one style for selector

      if (styleObject.indent && styleObject.indent > 0) {
        const { indent } = styleObject;
        const totalIndentation = Number(indent) * INDENTATION_WIDTH;
        // with indentation, there are only two possible values of `textAlign`: 'left' and 'right'. centered text cannot be indented in Excel
        const indentDirection = styleObject.textAlign === 'left' ? 'padding-left' : 'padding-right';

        result += `
        .handsontable td.${className} .sv-cell-text-wrapper {
          ${indentDirection}: ${totalIndentation}px;
         }
        `;
      }

      result += styleTextHorizontally(styleObject, className);

      if (styleObject.wordBreak === 'break-word') {
        result += styleTextVertically(styleObject, className);
      } else {
        result += styleHorizontalTextVertically(styleObject, className);
      }

      return result;
    })
    .join(' ');
  // } catch {
  // return '';
  // }
};
