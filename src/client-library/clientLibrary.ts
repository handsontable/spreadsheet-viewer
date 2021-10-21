import type { RequestMessage, WorkbookLocation } from '../sv/entities/RequestMessages';
import type { Configuration, CellRange } from '../sv/entities/MessagesShared';

export type { ThemeStylesheet } from '../sv/entities/MessagesShared';

export const ACTIVE_SHEET_CHANGED = 'activeSheetChanged';
export const CELL_SELECTION_CHANGED = 'cellSelectionChanged';
export const READY_FOR_MESSAGES = 'readyForMessages';
export const VIEW_ACTIVATED = 'viewActivated';
export const KEY_DOWN = 'keydown';
export const KEY_UP = 'keyup';
export const DROP = 'drop';
export const DRAG_OVER = 'dragover';
export const DRAG_LEAVE = 'dragleave';
export const initTimeout = 30000;

export class SpreadsheetViewerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

const generateId = (desiredLength: number): string => {
  const generated = Math.random().toString(36).substring(2);

  if (generated.length < desiredLength) {
    return generated + generateId(desiredLength - generated.length);
  }

  return generated.substring(0, desiredLength);
};

const hasQueryParameher = (url: string, targetParameter: string) => {
  const afterQuestionMarkPosition = url.lastIndexOf('?') + 1;
  return url.substring(afterQuestionMarkPosition).split('&').some((pair) => {
    const [param] = pair.split('=');
    return param === targetParameter;
  });
};

const appendQueryParameterToURL = (param: string, value: string, url: string): string => {
  if (hasQueryParameher(url, param)) {
    throw new SpreadsheetViewerError(`url cannot contain a parameter that already exists (${param})`);
  }

  const hasQuestionMark = url.indexOf('?') !== -1;

  return `${url + (hasQuestionMark ? '&' : '?') + encodeURIComponent(param)}=${encodeURIComponent(value)}`;
};

const ERROR_INIT_TIMEOUT = 'Initialization timeout';

type SendMessage = (message: RequestMessage) => void;
const createSendMessage = (targetWindow: Window): SendMessage => (message) => {
  targetWindow.postMessage(message, '*');
};

function createIframe(assetsUrl: string) {
  const iframe = document.createElement('iframe');
  iframe.className = 'spreadsheet-viewer-iframe';

  iframe.style.borderWidth = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';

  iframe.setAttribute('src', assetsUrl);
  return iframe;
}

function dispatchEvent(elem: HTMLElement, name: string, detail: object) {
  if (typeof window.CustomEvent === 'function') {
    const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail });
    elem.dispatchEvent(event);
  } else { // IE 11
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent(name, true, true, detail);
  }
}

export interface SpreadsheetViewerInstance {
  loadWorkbook: (workbook: WorkbookLocation, sheet: number, fileName?: string) => void;
  selectCells: (range: CellRange) => void;
  configure: (config: Partial<Configuration>) => void;
}

function hasOwnProperty<T extends {}, Property extends string>(
  input: T, property: Property
): input is T & Record<Property, unknown> {
  return Object.prototype.hasOwnProperty.call(input, property);
}

const safeLoadWorkbook = (sendMessage: SendMessage) => (workbook: unknown, sheet: unknown, fileName: unknown) => {
  if (typeof workbook !== 'string' && !(workbook instanceof ArrayBuffer)) {
    throw new TypeError(`Expected argument \`workbook\` to be either a string or an instance of ArrayBuffer, got ${typeof workbook}`);
  }

  if (typeof sheet !== 'number') {
    throw new TypeError(`Expected argument \`sheet\` to be a number, got ${typeof sheet}`);
  }

  if (fileName !== undefined && typeof fileName !== 'string') {
    throw new TypeError(`Expected argument \`fileName\` to be either undefined or a string, got ${typeof fileName}`);
  }

  if (workbook instanceof ArrayBuffer) {
    if (fileName === undefined) {
      throw new TypeError('Expected argument `fileName` to be present when `workbook` is an ArrayBuffer');
    }

    sendMessage({
      name: 'loadWorkbook',
      workbook,
      sheet,
      fileName
    });
  } else {
    sendMessage({
      name: 'loadWorkbook',
      workbook,
      sheet,
      fileName
    });
  }
};

function isArrayOfNumbers(input: unknown[]): input is number[] {
  return input.every(x => typeof x === 'number');
}

function isRange(input: unknown[]): input is CellRange {
  return isArrayOfNumbers(input) && input.length === 4;
}

const safeSelectCells = (sendMessage: SendMessage) => (range: unknown) => {
  if (!Array.isArray(range)) {
    throw new TypeError('Expected `range` to be an array');
  }

  if (!isRange(range)) {
    throw new TypeError(`Expected \`range\` to be a range [number, number, number, number], got ${range}`);
  }

  sendMessage({
    name: 'selectCells',
    range
  });
};

const safeConfigure = (sendMessage: SendMessage) => (config: unknown) => {
  if (typeof config !== 'object') {
    throw new TypeError(`Expected argument \`config\` to be an object, got ${typeof config}`);
  }

  if (config === null) {
    throw new TypeError('Expected argument `config` to not be null');
  }

  const themeStylesheet = (() => {
    if (!hasOwnProperty(config, 'themeStylesheet')) {
      return undefined;
    }

    if (
      typeof config.themeStylesheet !== 'string'
    || config.themeStylesheet !== 'dark'
    && config.themeStylesheet !== 'light'
    ) {

      throw new TypeError('config.themeStylesheet must either be undefined or "light" or "dark"');
    }

    return config.themeStylesheet;
  })();

  const licenseKey = (() => {
    if (!hasOwnProperty(config, 'licenseKey')) {
      return undefined;
    }

    if (typeof config.licenseKey !== 'string') {
      throw new TypeError('config.licenseKey must either be undefined or string');
    }

    return config.licenseKey;
  })();

  sendMessage({
    name: 'configure',
    themeStylesheet,
    licenseKey
  });
};

type SpreadsheetViewerOptions = {
  container: HTMLElement,
  assetsUrl: string
};

const createInstance = (contentWindow: HTMLIFrameElement['contentWindow']): SpreadsheetViewerInstance => {
  if (contentWindow === null) {
    throw new SpreadsheetViewerError('Attempted to initialize the library before the contentWindow was ready.');
  }

  const sendMessage = createSendMessage(contentWindow);

  return {
    loadWorkbook: safeLoadWorkbook(sendMessage),
    selectCells: safeSelectCells(sendMessage),
    configure: safeConfigure(sendMessage)
  };
};

// Settings the type explicitly like this allows us for both having the options
// type `unknown` in the implementation, and export it as
// `SpreadsheetViewerOptions` in the `d.ts`.
type SpreadsheetViewer = (options: SpreadsheetViewerOptions) => Promise<SpreadsheetViewerInstance>;
export const SpreadsheetViewer: SpreadsheetViewer = (options: unknown) => {
  if (typeof options !== 'object') {
    throw new TypeError(`\`options\` should be an object, got ${typeof options}`);
  }

  if (options === null) {
    throw new TypeError('`options` cannot be null');
  }

  if (!hasOwnProperty(options, 'assetsUrl')) {
    throw new TypeError('`options.assetsUrl` property must be present');
  }

  if (typeof options.assetsUrl !== 'string') {
    throw new TypeError(`\`assetsUrl\` property should be of type \`string\`, got ${typeof options.assetsUrl}`);
  }

  const { assetsUrl } = options;

  if (!hasOwnProperty(options, 'container')) {
    throw new TypeError('`options.container` property must be present');
  }

  if (!(options.container instanceof HTMLElement)) {
    throw new TypeError('`container` property should be an instance of HTMLElement');
  }

  const { container } = options;

  const svId = generateId(32);
  const frameSrc = appendQueryParameterToURL('svId', svId, assetsUrl);

  return new Promise<SpreadsheetViewerInstance>((resolve, reject) => {
    const secheduleRejection = setTimeout(() => {
      reject(new SpreadsheetViewerError(ERROR_INIT_TIMEOUT));
    }, initTimeout);

    const iframe = createIframe(frameSrc);

    window.addEventListener('message', (ev: MessageEvent) => {
      const { id } = ev.data;

      // Discard any messages that don't carry the identifier we generated when
      // creating the iframe. This ensures that we only handle messages for
      // just the iframe that was created during this `SpreadsheetViewer` call.
      if (id !== svId) {
        if (id?.indexOf('random-') >= -1) {
          console.warn(`Spreadsheet Viewer responded with a random 'svId' (${id}) that is different from the 'svId' (${svId}) generated by the client library. 
Perhaps the server has removed the 'svId' query string parameter using a redirection?`);
        }
        return;
      }

      switch (ev.data.name) {
        case ACTIVE_SHEET_CHANGED:
        case VIEW_ACTIVATED:
        case CELL_SELECTION_CHANGED:
        case KEY_DOWN:
        case KEY_UP:
        case DROP:
        case DRAG_OVER:
        case DRAG_LEAVE:
          dispatchEvent(container, ev.data.name, ev.data);
          break;

        case READY_FOR_MESSAGES: {
          clearTimeout(secheduleRejection);
          resolve(createInstance(iframe.contentWindow));
          break;
        }

        default:
          break;
      }
    });

    container.appendChild(iframe);
  });
};
