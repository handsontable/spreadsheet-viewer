// Includes types shared by ./CallbackMessages.ts and ./RequestMessages.ts
import { tuple, number, oneOf, exactly, Codec, string, optional } from 'purify-ts/Codec';
/**
 * [startRow, startCol, endRow, endCol]
 */
export var CellRange = tuple([number, number, number, number]);
export var ThemeStylesheet = oneOf([exactly('light'), exactly('dark')]);
export var ConfigurationProps = {
    themeStylesheet: optional(ThemeStylesheet),
    licenseKey: optional(string)
};
export var Configuration = Codec.interface(ConfigurationProps);
