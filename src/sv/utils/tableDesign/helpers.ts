import { BorderWidth } from '../../entities/SpreadsheetStyle';

export const getFgColor = (rgb: string) => {
  return { rgb };
};

const getBorder = (width: BorderWidth, color: string) => {
  return { width, color };
};

export const left = 'left';
export const top = 'top';
export const right = 'right';
export const bottom = 'bottom';
export const thin = 'thin';
export const medium = 'medium';
export const thick = 'thick';

export const getBorders = (keys: string[], width: BorderWidth, color: string) => {
  const borders: Record<string, {
    width: BorderWidth
    color: string
  }> = {};

  keys.forEach((key) => {
    borders[key] = getBorder(width, color);
  });

  return borders;
};
