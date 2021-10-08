// Includes types shared by ./CallbackMessages.ts and ./RequestMessages.ts

import {
  tuple, number, GetInterface, oneOf, exactly, Codec, string, optional
} from 'purify-ts/Codec';

/**
 * [startRow, startCol, endRow, endCol]
 */
export const CellRange = tuple([number, number, number, number]);
export type CellRange = GetInterface<typeof CellRange>;

export const ThemeStylesheet = oneOf([exactly('light'), exactly('dark')]);
export type ThemeStylesheet = GetInterface<typeof ThemeStylesheet>;

export type ViewName = 'loading';

export const ConfigurationProps = {
  themeStylesheet: optional(ThemeStylesheet),
  licenseKey: optional(string)
};

export const Configuration = Codec.interface(ConfigurationProps);
export type Configuration = GetInterface<typeof Configuration>;
