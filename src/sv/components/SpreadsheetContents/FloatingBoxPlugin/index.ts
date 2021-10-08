import Handsontable from 'handsontable';
import './index.less';
import { HotTableProperties } from '../utils';

export type FloatingObjectRenderer = (
  container: HTMLElement,
  width: number,
  height: number
) => void;

export type FloatingBoxSettings = {
  topLeftColumn: number;
  topLeftRow: number;
  bottomRightRow: number;
  bottomRightColumn: number;
  topLeftOffsetX: number;
  topLeftOffsetY: number;
  bottomRightOffsetX: number;
  bottomRightOffsetY: number;
  renderer: FloatingObjectRenderer;
};

type FloatingBoxMeta = {
  top: undefined | number,
  left: undefined | number,
  width: undefined | number,
  height: undefined | number,
  containerParents: Set<HTMLElement>,
  containers: Map<HTMLElement, HTMLDivElement>,
};

// `Handsontable#wt` is an internal Handsontable property
type WtOverlay = {
  sumCellSizes(start: number, end: number): number
};

type Wt = {
  getSetting(name: 'columnHeaders'): {
    length: number
  }
  getSetting(name: 'rowHeaders'): {
    length: number
  }
  wtOverlays: {
    leftOverlay: WtOverlay
    topOverlay: WtOverlay
  }
};

function createBoxContainer(box: FloatingBoxSettings, meta: FloatingBoxMeta, containerParent: HTMLElement) {
  const container = document.createElement('div');

  container.classList.add('sv-handsontable-floating-box');
  container.style.left = `${meta.left}px`;
  container.style.top = `${meta.top}px`;
  container.style.width = `${meta.width}px`;
  container.style.height = `${meta.height}px`;
  containerParent.appendChild(container);
  if (meta.width === undefined || meta.height === undefined) {
    throw new Error('Could not retrieve sizes of the floating box');
  }
  box.renderer(container, meta.width, meta.height);

  return container;
}

/**
 * Custom FloatingBox plugin for Handsontable, created for use in SpreadsheetViewer.
 *
 * @param hotInstance
 * @constructor
 */
class FloatingBoxPlugin extends Handsontable.plugins.BasePlugin {
  floatingBoxSettings: Array<FloatingBoxSettings> = [];

  floatingBoxMeta: WeakMap<FloatingBoxSettings, FloatingBoxMeta> = new WeakMap();

  constructor(hotInstance: Handsontable | undefined) {
    super(hotInstance);
    this.floatingBoxSettings = [];
    this.floatingBoxMeta = new WeakMap();
    this.resetState();
  }

  resetState() {
    this.floatingBoxSettings = [];
    this.floatingBoxMeta = new WeakMap();
  }

  /**
   * Method returns extended Handsontable GridSettings including property `floatingBox`
   */
  getExtendedHotSettings() {
    return this.hot.getSettings() as HotTableProperties;
  }

  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link HorizontalOverlapPlugin#enablePlugin} method is called.
   */
  isEnabled(): boolean {
    return !!this.getExtendedHotSettings().floatingBox;
  }

  /**
   * Enables the plugin functionality for this Handsontable instance.
   */
  enablePlugin() {
    if (this.enabled) {
      return;
    }

    this.addHook('afterLoadData', this.afterLoadData.bind(this));
    this.addHook('afterUpdateSettings', this.afterUpdateSettings.bind(this));
    this.addHook('afterRenderer', this.afterRenderer.bind(this));
    this.addHook('beforeRender', this.beforeRender.bind(this));
    this.addHook('afterRender', this.afterRender.bind(this));

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

  afterLoadData() {
    this.afterUpdateSettings();
  }

  afterRenderer(
    td: HTMLTableCellElement,
    row: number,
    column: number,
  ) {
    this.floatingBoxSettings.forEach((box) => {
      const meta = this.floatingBoxMeta.get(box);
      if (meta
      && box.topLeftRow <= row && box.topLeftColumn <= column
      && box.bottomRightRow >= row && box.bottomRightColumn >= column) {
        const currentParent = td.parentElement?.parentElement?.parentElement?.parentElement?.parentElement || undefined;
        if (currentParent && !meta.containerParents.has(currentParent)) {
          meta.containerParents.add(currentParent);
        }
      }
    });
  }

  beforeRender() {
    this.floatingBoxSettings.forEach((box) => {
      let meta = this.floatingBoxMeta.get(box);

      if (!meta) {
        meta = {
          top: undefined,
          left: undefined,
          width: undefined,
          height: undefined,
          containerParents: new Set(),
          containers: new Map(),
        };
        this.floatingBoxMeta.set(box, meta);
      }
    });
  }

  isFirstRender = true;

  afterRender() {
    // Temporary workaround for the problem https://github.com/handsontable/handsontable/issues/7164
    // as described in https://github.com/handsontable/spreadsheet-viewer-dev/issues/476#issuecomment-646301712
    if (this.isFirstRender) {
      this.isFirstRender = false;
      const hasMergedCells = (this.getExtendedHotSettings().mergeCells as []).length > 0;
      if (hasMergedCells) {
        return;
      }
    }

    if (this.floatingBoxSettings.length === 0) {
      return;
    }

    // bulk DOM reads
    this.floatingBoxSettings.forEach((box) => {
      const meta = this.floatingBoxMeta.get(box);

      if (meta && meta.containerParents.size > 0 && meta.width === undefined) {
      // adjustments needed to make floating box border position pixel perfect with the grid lines
        const adjustX = -1; //
        const adjustY = 3;
        const adjustWidth = -1;
        const adjustHeight = -1;

        // Code below is considered a hack, see
        // https://github.com/handsontable/spreadsheet-viewer-dev/issues/773
        const wt = (this.hot as any).view.wt as Wt;
        const startColumn = -wt.getSetting('columnHeaders').length;
        const startRow = -wt.getSetting('rowHeaders').length;

        meta.left = adjustX + box.topLeftOffsetX + wt.wtOverlays.leftOverlay.sumCellSizes(startColumn, box.topLeftColumn);
        meta.top = adjustY + box.topLeftOffsetY + wt.wtOverlays.topOverlay.sumCellSizes(startRow, box.topLeftRow);
        const summedColumnSizes = wt.wtOverlays.leftOverlay.sumCellSizes(box.topLeftColumn, box.bottomRightColumn + 1);
        meta.width = adjustWidth
        + box.bottomRightOffsetX
        - box.topLeftOffsetX
        + summedColumnSizes;
        const summedRowSizes = wt.wtOverlays.topOverlay.sumCellSizes(box.topLeftRow, box.bottomRightRow + 1);
        meta.height = adjustHeight
        + box.bottomRightOffsetY
        - box.topLeftOffsetY
        + summedRowSizes;
      }
    });

    // bulk DOM writes
    this.floatingBoxSettings.forEach((box) => {
      const meta = this.floatingBoxMeta.get(box);

      if (meta && meta.containerParents.size > meta.containers.size) {
        meta.containerParents.forEach((parent) => {
          if (!meta.containers.has(parent)) {
            const container = createBoxContainer(box, meta, parent);
            meta.containers.set(parent, container);
          }
        });
      }
    });
  }

  afterUpdateSettings() {
    const settings = this.getExtendedHotSettings();
    if (Array.isArray(settings.floatingBox)) {
      this.floatingBoxSettings = settings.floatingBox;
    } else {
      this.floatingBoxSettings = [];
    }
  }

  /**
   * Destroys the plugin instance.
   */
  destroy() {
    super.destroy();
  }
}

// You need to register your plugin in order to use it within Handsontable.
Handsontable.plugins.registerPlugin('FloatingBoxPlugin', FloatingBoxPlugin);
