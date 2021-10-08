// this module exists because there is a bug with mocha runner when try to test `cellGridlines` in separation

import { BorderStyles } from '../../../entities/SpreadsheetStyle';

export const showCellGridlines = (borders: BorderStyles | null | undefined) => {
  const areBordersExplicitlyOmitted = borders === null;
  // if borders are omitted (null), show gridlines otherwise just hide gridlines
  return areBordersExplicitlyOmitted;
};
