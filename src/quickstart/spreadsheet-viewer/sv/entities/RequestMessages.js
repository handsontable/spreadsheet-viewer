var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Codec, exactly, string, optional, number, oneOf } from 'purify-ts/Codec';
import { Right, Left } from 'purify-ts/Either';
import { CellRange, ConfigurationProps } from './MessagesShared';
var ArrayBufferCodec = Codec.custom({
    decode: function (value) { return ((value instanceof ArrayBuffer) ? Right(value) : Left('Specified value isn\'t an instance of ArrayBuffer')); },
    encode: function (ab) { return ab; }
});
/**
 * A data URL string, a remote URL, or an ArrayBuffer representing the file
 * contents.
 */
export var WorkbookLocation = oneOf([string, ArrayBufferCodec]);
/**
 * Request message to Spreadsheet Viewer to render a file.
 */
export var loadWorkbook = 'loadWorkbook';
var loadWorkbookCommon = {
    name: exactly(loadWorkbook),
    /**
     * A number, starting from 0, representing the index of the sheet within the document. Default value: 0
     */
    sheet: number
};
export var LoadWorkbook = oneOf([Codec.interface(__assign({ workbook: ArrayBufferCodec, 
        // If the provided `workbook` is an ArrayBuffer, `fileName` becomes
        // non-optional.
        fileName: string }, loadWorkbookCommon)), Codec.interface(__assign({ workbook: string, fileName: optional(string) }, loadWorkbookCommon))]);
/**
 * Request message from end-user that request selecting cells in the SV.
 */
export var selectCells = 'selectCells';
export var SelectCells = Codec.interface({
    name: exactly(selectCells),
    range: CellRange
});
/**
 * Request message that request switching theme colors in the SV to `light` or `dark`.
 */
export var configure = 'configure';
export var Configure = Codec.interface(__assign({ name: exactly(configure) }, ConfigurationProps));
