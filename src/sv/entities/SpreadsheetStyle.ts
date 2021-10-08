export type BorderWidth = 'thin' | 'medium' | 'thick';

export type BorderStyle = {
  width: BorderWidth,
  color: string
};

export type BorderStyles = { left?: BorderStyle, top?: BorderStyle, right?: BorderStyle, bottom?: BorderStyle };

export type SpreadsheetStyle = {
  patternType?: string;
  fgColor?: { rgb?: string, theme?:ThemeId };
  bgColor?: { rgb?: string, theme?:ThemeId };
  border?: BorderStyles;
  indent?: number;
  wordBreak?: string;
  verticalAlign?: string;
  fontStyle?: string;
  fontStretch?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: 'bold' | 'normal' | number;
  color?: string;
  textAlign?: string;
  textDecoration?: string;
  textShadow?: string;
  overflow?: string;
  whiteSpace?: string;
  display?: string
  direction?: string;
  theme?: ThemeId;
  lineHeight?: string;
};
export type ThemeId = number;
