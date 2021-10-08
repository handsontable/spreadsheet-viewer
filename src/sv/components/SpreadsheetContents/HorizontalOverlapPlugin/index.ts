import Handsontable from 'handsontable';
import {
  INDENTATION_WIDTH,
  HORIZONTAL_PADDING_LEFT,
  HORIZONTAL_PADDING_RIGHT,
  GRIDLINE_WIDTH,
  HotCellProperties,
  HotTableProperties
} from '../utils';
import './index.less';

export const stringifyCoords = (row: number, col: number): StringifiedCoords => {
  return `${row},${col}`; // The performance of it is OK: http://jsbench.github.io/#d0a336a4f16d10a8ebdd078c50b52418
};

const createMeasuringContainer = function(id: string) {
  if (document.getElementById(id)) {
    throw new Error('measuringContainer already exists');
  }
  const elem = document.createElement('div');
  elem.setAttribute('id', id);
  document.body.appendChild(elem);
  return elem;
};

let measuringContainer: HTMLDivElement | undefined;

const createMeasuringContext = (font: string): CanvasRenderingContext2D => {
  const canvas = document.createElement('canvas');

  if (measuringContainer === undefined) {
    throw new Error('measuringContainer doesn\'t exist');
  }

  measuringContainer.appendChild(canvas);
  const context = canvas.getContext('2d');

  if (context === null) {
    throw new Error('Failed to obtain CanvasRenderingContext2D');
  }

  context.font = font;
  return context;
};

const measuringContexts = new Map<string, CanvasRenderingContext2D>();
const memoizedMeasurements = new Map<string, number>();

const measureTextPrepare = () => {
  measuringContexts.clear();
  memoizedMeasurements.clear();
  measuringContainer = createMeasuringContainer('sv-handsontable-horizontal-overlay-measuring');
};

const measureTextCleanup = () => {
  measuringContainer?.parentElement?.removeChild(measuringContainer);
};

const measureTextUsingFont = function(text: string, font: string) {
  const key = `${text}|${font}`;
  const found = memoizedMeasurements.get(key);
  if (found !== undefined) {
    return found;
  }

  let context = measuringContexts.get(font);
  if (!context) {
    context = createMeasuringContext(font);
    measuringContexts.set(font, context);
  }

  const measuringRect = context.measureText(text);
  const { width } = measuringRect;
  memoizedMeasurements.set(key, width);
  return width;
};

export type StringifiedCoords = string; // e.g. '0,0'
export type StringifiedCoordsSet = Set<StringifiedCoords>;
// This is a temporary workaround for https://github.com/handsontable/handsontable/issues/6788
interface CustomBordersBorderOptions extends Handsontable.customBorders.BorderOptions {
  hide?: boolean
}
type CustomBordersSettings = Handsontable.customBorders.Settings;
type CustomBordersConfigMap = Map<StringifiedCoords, CustomBordersSettings>;

/**
 * Custom HorizontalOverlap plugin for Handsontable, created for use in SpreadsheetViewer.
 * TODO overlaps that span from left overlay do not render correctly, especially if they end with a border. See `trim-empty.rows.xlsx`
 *
 * @param hotInstance
 * @constructor
 */
class HorizontalOverlapPlugin extends Handsontable.plugins.BasePlugin {

  resetState() {
    this.measureAllCells();
  }

  /**
   * Method returns extended Handsontable GridSettings including property `horizontalOverlap`
   */
  getExtendedHotSettings() {
    return this.hot.getSettings() as HotTableProperties;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link HorizontalOverlapPlugin#enablePlugin} method is called.
   */
  isEnabled(): boolean {
    return !!this.getExtendedHotSettings().horizontalOverlap;
  }

  /**
   * Enables the plugin functionality for this Handsontable instance.
   */
  enablePlugin() {
    if (this.enabled) {
      return;
    }

    // see: https://handsontable.com/docs/8.1.0/Hooks.html
    this.addHook('init', this.onInit.bind(this));

    super.enablePlugin();
  }

  /**
   * Disables the plugin functionality for this Handsontable instance.
   */
  disablePlugin() {
    this.resetState();

    super.disablePlugin();
  }

  /**
   * The updatePlugin method is called on the afterUpdateSettings hook (unless the updateSettings method turned the plugin off).
   * It should contain all the stuff your plugin needs to do to work properly after the Handsontable instance settings were modified.
   */
  updatePlugin() {
    this.disablePlugin();
    this.enablePlugin();

    super.updatePlugin();
  }

  onInit() {
    this.resetState();
  }

  createCustomBordersMap(customBordersConfig: Handsontable.customBorders.Settings[]) {
    const map = new Map();
    for (let i = 0; i < customBordersConfig.length; i++) {
      const { row, col } = customBordersConfig[i] as {row: number, col: number};
      const key = stringifyCoords(row, col);
      map.set(key, customBordersConfig[i]);
    }
    return map;
  }

  measureAllCells() {
    const { customBorders, horizontalOverlap } = this.getExtendedHotSettings();
    const customBorderConfigMap: CustomBordersConfigMap = this.createCustomBordersMap(customBorders);
    const data = this.hot.getData() as Array<(string[] | null[])>;
    const countCols = data[0].length;
    measureTextPrepare(); // clear the widths cache, because with old fonts the cache contains wrong values
    horizontalOverlap.startCells.forEach((key) => {
      const [row, col] = key.split(',').map(x => parseInt(x, 10));
      const rowData = data[row];
      this.performTextOverlapping(row, col, countCols, rowData, customBorderConfigMap); // configures styleRenderer for this cell if needed
    });
    measureTextCleanup();
  }

  hideBorderLeftEdge(map: CustomBordersConfigMap, row: number, col: number) {
    const key = stringifyCoords(row, col);
    const customBorder = map.get(key);
    if (customBorder) {
      this.hideBorderEdge(customBorder.left as CustomBordersBorderOptions);
    }
  }

  hideBorderRightEdge(map: CustomBordersConfigMap, row: number, col: number) {
    const key = stringifyCoords(row, col);
    const customBorder = map.get(key);
    if (customBorder) {
      this.hideBorderEdge(customBorder.right as CustomBordersBorderOptions);
    }
  }

  hideBorderEdge(borderEdge: CustomBordersBorderOptions) {
    if (borderEdge && !borderEdge.hide) {
      borderEdge.hide = true;
    }
  }

  // returns the amount of # characters equal to the length of the provided string
  obscureString(str: string) {
    return Array(str.length).fill('#').join('');
  }

  performTextOverlapping(row: number, col: number, countCols: number, rowData: string[] | null[], customBorderConfigMap: CustomBordersConfigMap) {
    let textAlignment = 'left';
    let isWordWrap = false;
    let indentationPx = 0;
    const cellProperties = this.getCellProperties(row, col);
    const {
      columns, colWidths, rowHeights, horizontalOverlap
    } = this.getExtendedHotSettings();
    const isLeftNeighborStopCell = horizontalOverlap.stopCells.has(stringifyCoords(row, col - 1));
    const isRightNeighborStopCell = horizontalOverlap.stopCells.has(stringifyCoords(row, col + 1));

    if (cellProperties.isTextContent && isLeftNeighborStopCell && isRightNeighborStopCell) {
      return; // we can't overlap from this cell, because it is blocked in all directions
    }

    const styleId = cellProperties.cellClassName || '';
    const styleObj = horizontalOverlap.styleMap[styleId];
    if (styleObj) { // sometimes there is no styleObj, for example chart-sheet.xlsx
      if (styleObj.textAlign) {
        textAlignment = styleObj.textAlign;
      }

      if (styleObj.indent) {
        indentationPx = styleObj.indent * INDENTATION_WIDTH;
      }
      if (styleObj.wordBreak === 'break-word') {
        isWordWrap = true;
      }
    }

    if (cellProperties.isTextContent) {
      if (isWordWrap) {
        return; // we can't overflow from this cell, because it has word wrapping
      }
      if (textAlignment === 'right') {
        if (col === 0) {
          return; // we can't overflow to the left, because there are no columns on the left
        }
        if (isLeftNeighborStopCell) {
          return; // we can't overflow to the left, because the previous cell is a stop cell
        }
      } else if (isRightNeighborStopCell) {
        // in the first pass, text alignment "center" behaves as "left"
        return; // we can't overflow to the right, because the next cell is a stop cell
      }
    }

    const coords = stringifyCoords(row, col);

    if (!Array.isArray(colWidths)) {
      throw new Error('colWidths must be an Array');
    }

    if (!Array.isArray(rowHeights)) {
      throw new Error('rowHeights must be an Array');
    }

    const paddingAroundIntrinsicWidth = HORIZONTAL_PADDING_LEFT + GRIDLINE_WIDTH;
    const colWidth = colWidths[col] as number;
    const font = styleObj ? `${styleObj.fontStyle || ''} ${styleObj.fontWeight || ''} ${styleObj.fontStretch || ''} ${styleObj.fontSize} ${styleObj.fontFamily}` : '';

    const cellData = rowData[col];
    if (cellData === null) {
      throw new Error(`rowData[${col}] must be a string`);
    }
    const measuredWidth = measureTextUsingFont(cellData, font);

    const intrinsicWidth = measuredWidth + indentationPx;

    if (intrinsicWidth) {
      const paddedIntrinsicWidth = intrinsicWidth + paddingAroundIntrinsicWidth;

      if (paddedIntrinsicWidth > colWidth) {
        if (!cellProperties.isTextContent) {
          horizontalOverlap.obscuredNonText.set(coords, this.obscureString(cellData));
          return;
        }

        let overlapX = 0;
        let overlapSum = colWidth;
        let reverse = false;

        if (textAlignment === 'right') {
          reverse = true;
        }

        let neighborColLeft = col - 1;
        let neighborColRight = col + 1;

        while (overlapSum < paddedIntrinsicWidth) {
          if (reverse) { // going left
            if (neighborColLeft < 0) {
              break;
            }

            if (horizontalOverlap.stopCells.has(stringifyCoords(row, neighborColLeft))) {
              break;
            }

            const neighborColWidth = colWidths[neighborColLeft];
            overlapSum += Number(neighborColWidth);
            overlapX -= Number(neighborColWidth);
            horizontalOverlap.hideRightGridlineTds.add(stringifyCoords(row, neighborColLeft));

            this.hideBorderLeftEdge(customBorderConfigMap, row, neighborColLeft + 1);
            this.hideBorderRightEdge(customBorderConfigMap, row, neighborColLeft);

            neighborColLeft -= 1;
          } else { // going right
            const shouldAddContentAreaColumn = neighborColRight === countCols;
            if (shouldAddContentAreaColumn) {
              if (columns.length === countCols) {
                // append extra column to HOT config
                columns.length = countCols + 1;
                colWidths[countCols] = 0;
                (this.hot as any).initIndexMappers();
              }
              const addedColumnWidth = paddedIntrinsicWidth - overlapSum + HORIZONTAL_PADDING_RIGHT;
              if (colWidths[countCols] < addedColumnWidth) {
                colWidths[countCols] = addedColumnWidth;
              }
            }

            if (horizontalOverlap.stopCells.has(stringifyCoords(row, neighborColRight))) {
              break;
            }

            const neighborWidth = colWidths[neighborColRight];
            overlapSum += Number(neighborWidth);
            horizontalOverlap.hideRightGridlineTds.add(stringifyCoords(row, neighborColRight - 1));

            this.hideBorderLeftEdge(customBorderConfigMap, row, neighborColRight);
            this.hideBorderRightEdge(customBorderConfigMap, row, neighborColRight - 1);

            neighborColRight += 1;
          }

          if (textAlignment === 'center') {
            reverse = !reverse;
          }
        }

        const tdHeight = Number(rowHeights[row]) - GRIDLINE_WIDTH;
        horizontalOverlap.overlapStartCells.set(coords, {
          left: `${overlapX}px`,
          width: `${overlapSum - HORIZONTAL_PADDING_LEFT - GRIDLINE_WIDTH}px`,
          height: `${tdHeight}px` // TODO check overlap of big font, because row 16 in styling.xlsx
        });
      }
    }
  }

  private getCellProperties(row: number, col: number) {
    return this.hot.getCellMeta(row, col) as HotCellProperties;
  }

  /**
   * Destroys the plugin instance.
   */
  destroy() {
    super.destroy();
  }
}

// You need to register your plugin in order to use it within Handsontable.
Handsontable.plugins.registerPlugin('HorizontalOverlapPlugin', HorizontalOverlapPlugin);
