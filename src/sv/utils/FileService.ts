import type {
  WorkSheet,
  WorkBookStyles,
  RowInfo,
  ColInfo,
  CellObject,
  Theme,
  WorkBook
} from '@handsontable/js-xlsx';
import {
  SJS_COLS_KEY,
  SJS_ROWS_KEY,
  SJS_DEFAULT_SIZES_KEY,
  SJS_TABLES
} from '../entities/SpreadsheetJsonKeys';
import { SpreadsheetStyle } from '../entities/SpreadsheetStyle';
import { applyTablesStylesToCells } from './TableStylesService';
import { IdToSpreadsheetStyleMap } from '../entities/SpreadsheetStyleMap';
import { applyThemeColors } from './ThemeService';

export interface svColInfo extends ColInfo {
  svStyleId?: string; // identifier used as the CSS class name in the SV and as the key in the style map
  style:any; // todo lack of type
}

export interface svRowInfo extends RowInfo {
  svStyleId?: string; // identifier used as the CSS class name in the SV and as the key in the style map
  style: any; // todo lack of type
}

export interface svCellObject extends CellObject {
  svStyleId?: string; // identifier used as the CSS class name in the SV and as the key in the style map
  isTextContent: boolean;
}

type StyleIdCache = Map<string, string>; // stringified style -> hash

type StyleMap = Record<string, SpreadsheetStyle>;

let globalStyleIdCounter = 0;
const PT_TO_PX_CSS_SPEC_CONVERTION_RATIO = 96 / 72; // pt to px unit conversion ratio according to the CSS spec
const PT_TO_PX_SPECIAL_SV_TEXT_CONVERTION_RATIO = 1.2; // agreed font size conversion ratio agreed for the SV app
const LINE_HEIGHT_CSS_SPEC_RELATIVE_RATIO = 1.2; // font size to line height default relative conversion ratio according to the CSS spec

/**
 * Function translate points to pixel.
 * 1pt = 96/72
 * @link https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
 */
const translatePointsToPixels = (points: number) => {
  return points * PT_TO_PX_CSS_SPEC_CONVERTION_RATIO;
};

/**
 * Translate points to row heights in px with the desired rounding.
 */
const translatePointsToPixelRowHeight = (points: number) => {
  return Math.ceil(translatePointsToPixels(points));
};

/**
 * Function translate points to font sizes in px. The result is smaller text compared to what
 * would be the outcome from `translatePointsToPixels`. The reason for it is to fit the text
 * created on Windows with DPI setting different than 100%
 * @see https://github.com/handsontable/spreadsheet-viewer-dev/issues/771#issuecomment-718614461
 */
const translatePointsToPixelFontSize = (points: number) => {
  return Math.round(points * PT_TO_PX_SPECIAL_SV_TEXT_CONVERTION_RATIO);
};

/**
 * Generates line-height value in pixels, according to the ratio used in the CSS spec
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
 */
const generateLineHeightForFontSize = (pixels: number) => {
  return pixels * LINE_HEIGHT_CSS_SPEC_RELATIVE_RATIO;
};

const fixupStyle = (styleObj: SpreadsheetStyle, isValueString: boolean) => {
  if (styleObj.fontSize) {
    const sizeInPt = parseInt(styleObj.fontSize, 10);
    styleObj.fontSize = `${translatePointsToPixelFontSize(sizeInPt)}px`;
    styleObj.lineHeight = `${generateLineHeightForFontSize(translatePointsToPixels(sizeInPt))}px`;
  }
  // in XML when there is no vertical alignment property, means that content is aligned to the bottom
  if (!styleObj.verticalAlign) {
    styleObj.verticalAlign = 'bottom';
  }
  if (styleObj.direction) {
    // Workaround for a questionable patch in JS-XLSX,
    // explained in detail in https://github.com/handsontable/spreadsheet-viewer-demo/pull/251#discussion_r383936220
    styleObj.direction = undefined;
  }
  if (!isValueString && !styleObj.textAlign) {
    styleObj.textAlign = 'right';
  }
};

const getSvCellObject = (sheet: WorkSheet, cellAddr: string): svCellObject => sheet[cellAddr] as svCellObject;

/**
 * Build map of excel cell classes/styles
 * @param sheet
 */
const buildCellStyles = (sheet: WorkSheet, styleIdCache: StyleIdCache): IdToSpreadsheetStyleMap => {
  const styleMap: StyleMap = {};
  const cellKeyEx = /^[A-Z]/;
  const cellKeys = Object.keys(sheet).filter(k => k.match(cellKeyEx));
  cellKeys.forEach((cellAddr) => {
    const cell = getSvCellObject(sheet, cellAddr);
    const styleObj = cell.s;
    if (!styleObj) {
      return;
    }
    const isValueString = cell.t === 's';
    const key = JSON.stringify(styleObj) + isValueString;
    let styleId = styleIdCache.get(key);
    if (!styleId) {
      styleId = `_sv-cell-${globalStyleIdCounter}`;
      globalStyleIdCounter += 1;
      styleIdCache.set(key, styleId);
      fixupStyle(styleObj, isValueString);
      styleMap[styleId] = styleObj;
    }
    cell.svStyleId = styleId;
    cell.s = null; // TODO perf: most probably this causes deoptimization in JIT. Return a new object instead
    cell.isTextContent = isValueString;
  });
  return styleMap;
};

/**
 * This function updates the row object to contain correct values for hpx.
 * JS-XLSX incorrectly returns the same values for hpt and hpx.
 * In future, this fix might be applied directly in JS-XLSX.
 */
const calculateRowHeights = (sheet: WorkSheet) => {
  const rowData = sheet[SJS_ROWS_KEY];
  if (rowData) {
    const calculatedRowsHeights = rowData.map((row) => {
      if (!row) { // check for value, because sheet[SJS_ROWS_KEY] might be a sparse array
        return row;
      }

      return { ...row, hpx: row.hpt !== undefined ? translatePointsToPixelRowHeight(row.hpt) : NaN };
    });
    sheet[SJS_ROWS_KEY] = calculatedRowsHeights;
  }
  if (sheet[SJS_DEFAULT_SIZES_KEY]?.rows?.hpx) {
    sheet[SJS_DEFAULT_SIZES_KEY].rows.hpx = translatePointsToPixelRowHeight(sheet[SJS_DEFAULT_SIZES_KEY].rows.hpx);
  }
};

type CellXf = {
  applyBorder: boolean
  applyFill: boolean
  borderId: number
  fillId: number
};

function parseRowOrColumnStyle(styleMap: StyleMap, styleIndex: string | undefined, styles: WorkBookStyles, themes: Theme[], styleIdCache: StyleIdCache) {
  if (styleIndex === undefined) {
    return;
  }

  const cellXf = styles.CellXf?.[Number(styleIndex)] as CellXf | undefined;

  if (!cellXf || !(cellXf.applyBorder || cellXf.applyFill)) {
    return;
  }
  const styleObj: SpreadsheetStyle = {};
  if (cellXf.applyBorder === true) {
    styleObj.border = styles.Borders?.[cellXf.borderId];
  }
  if (cellXf.applyFill === true) {
    const fillObj = styles.Fills?.[cellXf.fillId];
    Object.assign(styleObj, fillObj);
  }

  applyThemeColors(styleObj, themes);

  const key = JSON.stringify(styleObj);
  let styleId = styleIdCache.get(key);
  if (!styleId) {
    styleId = `_sv-col-${globalStyleIdCounter}`;
    globalStyleIdCounter += 1;
    styleIdCache.set(key, styleId);
    styleMap[styleId] = styleObj;
  }

  return styleId;
}

const parseRowAndColumnStyles = (sheet: WorkSheet, styles: WorkBookStyles | undefined, themes: Theme[], styleIdCache: StyleIdCache) => {
  if (!styles) return {};

  const styleMap = {};
  const colData = sheet[SJS_COLS_KEY];
  if (colData) {
    colData.forEach((col) => {
      if (!col) { // check for value, because sheet[SJS_COLS_KEY] might be a sparse array
        return col;
      }

      (col as svColInfo).svStyleId = parseRowOrColumnStyle(styleMap, col.style, styles, themes, styleIdCache);
    });
  }

  const rowData = sheet[SJS_ROWS_KEY];
  if (rowData) {
    rowData.forEach((row) => {
      if (!row) { // check for value, because sheet[SJS_ROWS_KEY] might be a sparse array
        return;
      }

      (row as svRowInfo).svStyleId = parseRowOrColumnStyle(styleMap, row.style, styles, themes, styleIdCache);
    });
  }

  return styleMap;
};

export interface ParsedData {
  styleMap: IdToSpreadsheetStyleMap;
  sheetsData: ParsedSheetData[];
}

interface ParsedSheetData {
  title: string;
  data: WorkSheet | null;
}

const trimColumns = (sheet: WorkSheet) => {
  const colData = sheet[SJS_COLS_KEY];
  // todo important: use const UPPER_HARD_LIMIT_COLUMNS (rethink architecture first!).
  if (colData && colData.length > 256) {
    // when there are default columns, this array has 16384 elements, even if only one column has content.
    // TODO trim this to the number of columns that have any content
    // todo important: use const UPPER_HARD_LIMIT_COLUMNS (rethink architecture first!).
    colData.length = 256;
  }
};

const getThemes = (workbook: WorkBook) => {
  return workbook.Themes?.themeElements?.clrScheme || [];
};

/**
 * Make external transformations after parsing file. Those transformations cannot be part of SJS library because of stream nature of data processing it employs
 */
export const fixupData = (workbook: WorkBook): ParsedData => {
  const styleIdCache: StyleIdCache = new Map();
  const sheets: ParsedSheetData[] = [];
  let globalStyleMap: IdToSpreadsheetStyleMap = {};

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      sheets.push({
        title: sheetName,
        data: null
      });

      return;
    }

    if (sheet[SJS_TABLES]) {
      applyTablesStylesToCells(sheet);
    }

    const sheetStyleMap = buildCellStyles(sheet, styleIdCache);

    trimColumns(sheet);
    const rowAndColumnStyleMap = parseRowAndColumnStyles(sheet, workbook.Styles, getThemes(workbook), styleIdCache);
    calculateRowHeights(sheet);

    sheets.push({
      title: sheetName,
      data: sheet
    });

    globalStyleMap = { ...globalStyleMap, ...rowAndColumnStyleMap, ...sheetStyleMap };
  });

  return {
    styleMap: globalStyleMap,
    sheetsData: sheets
  };
};
