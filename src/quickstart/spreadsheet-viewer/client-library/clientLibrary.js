var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
export var ACTIVE_SHEET_CHANGED = 'activeSheetChanged';
export var CELL_SELECTION_CHANGED = 'cellSelectionChanged';
export var READY_FOR_MESSAGES = 'readyForMessages';
export var VIEW_ACTIVATED = 'viewActivated';
export var KEY_DOWN = 'keydown';
export var KEY_UP = 'keyup';
export var DROP = 'drop';
export var DRAG_OVER = 'dragover';
export var DRAG_LEAVE = 'dragleave';
export var initTimeout = 30000;
var SpreadsheetViewerError = /** @class */ (function (_super) {
    __extends(SpreadsheetViewerError, _super);
    function SpreadsheetViewerError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        return _this;
    }
    return SpreadsheetViewerError;
}(Error));
export { SpreadsheetViewerError };
var generateId = function (desiredLength) {
    var generated = Math.random().toString(36).substring(2);
    if (generated.length < desiredLength) {
        return generated + generateId(desiredLength - generated.length);
    }
    return generated.substring(0, desiredLength);
};
var hasQueryParameher = function (url, targetParameter) {
    var afterQuestionMarkPosition = url.lastIndexOf('?') + 1;
    return url.substring(afterQuestionMarkPosition).split('&').some(function (pair) {
        var param = pair.split('=')[0];
        return param === targetParameter;
    });
};
var appendQueryParameterToURL = function (param, value, url) {
    if (hasQueryParameher(url, param)) {
        throw new SpreadsheetViewerError("url cannot contain a parameter that already exists (" + param + ")");
    }
    var hasQuestionMark = url.indexOf('?') !== -1;
    return url + (hasQuestionMark ? '&' : '?') + encodeURIComponent(param) + "=" + encodeURIComponent(value);
};
var ERROR_INIT_TIMEOUT = 'Initialization timeout';
var createSendMessage = function (targetWindow) { return function (message) {
    targetWindow.postMessage(message, '*');
}; };
function createIframe(assetsUrl) {
    var iframe = document.createElement('iframe');
    iframe.className = 'spreadsheet-viewer-iframe';
    iframe.style.borderWidth = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.setAttribute('src', assetsUrl);
    return iframe;
}
function dispatchEvent(elem, name, detail) {
    if (typeof window.CustomEvent === 'function') {
        var event_1 = new CustomEvent(name, { bubbles: true, cancelable: true, detail: detail });
        elem.dispatchEvent(event_1);
    }
    else { // IE 11
        var event_2 = document.createEvent('CustomEvent');
        event_2.initCustomEvent(name, true, true, detail);
    }
}
function hasOwnProperty(input, property) {
    return Object.prototype.hasOwnProperty.call(input, property);
}
var safeLoadWorkbook = function (sendMessage) { return function (workbook, sheet, fileName) {
    if (typeof workbook !== 'string' && !(workbook instanceof ArrayBuffer)) {
        throw new TypeError("Expected argument `workbook` to be either a string or an instance of ArrayBuffer, got " + typeof workbook);
    }
    if (typeof sheet !== 'number') {
        throw new TypeError("Expected argument `sheet` to be a number, got " + typeof sheet);
    }
    if (fileName !== undefined && typeof fileName !== 'string') {
        throw new TypeError("Expected argument `fileName` to be either undefined or a string, got " + typeof fileName);
    }
    if (workbook instanceof ArrayBuffer) {
        if (fileName === undefined) {
            throw new TypeError('Expected argument `fileName` to be present when `workbook` is an ArrayBuffer');
        }
        sendMessage({
            name: 'loadWorkbook',
            workbook: workbook,
            sheet: sheet,
            fileName: fileName
        });
    }
    else {
        sendMessage({
            name: 'loadWorkbook',
            workbook: workbook,
            sheet: sheet,
            fileName: fileName
        });
    }
}; };
function isArrayOfNumbers(input) {
    return input.every(function (x) { return typeof x === 'number'; });
}
function isRange(input) {
    return isArrayOfNumbers(input) && input.length === 4;
}
var safeSelectCells = function (sendMessage) { return function (range) {
    if (!Array.isArray(range)) {
        throw new TypeError('Expected `range` to be an array');
    }
    if (!isRange(range)) {
        throw new TypeError("Expected `range` to be a range [number, number, number, number], got " + range);
    }
    sendMessage({
        name: 'selectCells',
        range: range
    });
}; };
var safeConfigure = function (sendMessage) { return function (config) {
    if (typeof config !== 'object') {
        throw new TypeError("Expected argument `config` to be an object, got " + typeof config);
    }
    if (config === null) {
        throw new TypeError('Expected argument `config` to not be null');
    }
    var themeStylesheet = (function () {
        if (!hasOwnProperty(config, 'themeStylesheet')) {
            return undefined;
        }
        if (typeof config.themeStylesheet !== 'string'
            || config.themeStylesheet !== 'dark'
                && config.themeStylesheet !== 'light') {
            throw new TypeError('config.themeStylesheet must either be undefined or "light" or "dark"');
        }
        return config.themeStylesheet;
    })();
    var licenseKey = (function () {
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
        themeStylesheet: themeStylesheet,
        licenseKey: licenseKey
    });
}; };
var createInstance = function (contentWindow) {
    if (contentWindow === null) {
        throw new SpreadsheetViewerError('Attempted to initialize the library before the contentWindow was ready.');
    }
    var sendMessage = createSendMessage(contentWindow);
    return {
        loadWorkbook: safeLoadWorkbook(sendMessage),
        selectCells: safeSelectCells(sendMessage),
        configure: safeConfigure(sendMessage)
    };
};
export var SpreadsheetViewer = function (options) {
    if (typeof options !== 'object') {
        throw new TypeError("`options` should be an object, got " + typeof options);
    }
    if (options === null) {
        throw new TypeError('`options` cannot be null');
    }
    if (!hasOwnProperty(options, 'assetsUrl')) {
        throw new TypeError('`options.assetsUrl` property must be present');
    }
    if (typeof options.assetsUrl !== 'string') {
        throw new TypeError("`assetsUrl` property should be of type `string`, got " + typeof options.assetsUrl);
    }
    var assetsUrl = options.assetsUrl;
    if (!hasOwnProperty(options, 'container')) {
        throw new TypeError('`options.container` property must be present');
    }
    if (!(options.container instanceof HTMLElement)) {
        throw new TypeError('`container` property should be an instance of HTMLElement');
    }
    var container = options.container;
    var svId = generateId(32);
    var frameSrc = appendQueryParameterToURL('svId', svId, assetsUrl);
    return new Promise(function (resolve, reject) {
        var secheduleRejection = setTimeout(function () {
            reject(new SpreadsheetViewerError(ERROR_INIT_TIMEOUT));
        }, initTimeout);
        var iframe = createIframe(frameSrc);
        window.addEventListener('message', function (ev) {
            var id = ev.data.id;
            // Discard any messages that don't carry the identifier we generated when
            // creating the iframe. This ensures that we only handle messages for
            // just the iframe that was created during this `SpreadsheetViewer` call.
            if (id !== svId) {
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
