import { Theme } from '@handsontable/js-xlsx';
import { SpreadsheetStyle } from '../entities/SpreadsheetStyle';

export const applyThemeColors = (style: SpreadsheetStyle, themes: Theme[]): void => {
  const { fgColor } = style;
  if (fgColor !== undefined && fgColor.theme !== undefined && themes[fgColor.theme]?.rgb) {
    fgColor.rgb = fgColor.rgb || themes[fgColor.theme].rgb;
  }

  const { bgColor } = style;
  if (bgColor !== undefined && bgColor.theme !== undefined && themes[bgColor.theme]?.rgb) {
    bgColor.rgb = bgColor.rgb || themes[bgColor.theme].rgb;
  }
};
