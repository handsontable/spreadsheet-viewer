import { BuiltInTableStyles, TableStyleFragments } from '../../entities/SpreadsheetTableStyle';
import { darkTableStyles } from './darkStyles';
import { lightTableStyles } from './lightStyles';
import { mediumTableStyles } from './mediumStyles';
import { hasOwnProperty } from '../has-own-property';

/*
  @TODO Most likely additional parameters should be taken into consideration if we are going to support custom styles.
  eg. Probably it is possible to hide column titles (header), in this case, even row will be matched as odd row.

  @NOTE Order of properties actually matters, because each matched fragment, will apply styles to table styles object.
  If two different fragments will define same property, then value of fragment which is defined higher is going to be applied.
  Look at getCellStylesFromStyleFragments implementation.
*/
export const builtInTableStyles: Record<BuiltInTableStyles, TableStyleFragments | null> = {
  ...lightTableStyles,
  ...mediumTableStyles,
  ...darkTableStyles
};

export const getStyleFragmentsFromName = (styleName: string): TableStyleFragments => {
  if (!hasOwnProperty(builtInTableStyles, styleName)) {
    // You can add support for built in Excel table styles in src/sv/utils/BuiltInTableStyles.ts`)
    console.warn(`Table style "${styleName}" is not implemented!`);

    return {};
  }

  const styleFragments = builtInTableStyles[styleName];

  if (!styleFragments) {
    return {};
  }

  return styleFragments;
};
