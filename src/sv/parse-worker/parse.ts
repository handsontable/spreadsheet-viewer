import {
  read, ParsingOptions, WorkBook, PartialParsingFunction
} from '@handsontable/js-xlsx';

export const SJSreadOpts: ParsingOptions = {
  dense: false,
  cellFormula: true,
  bookVBA: true,
  cellNF: true,
  cellHTML: true,
  cellStyles: true,
  sheetStubs: true,
  cellDates: true
};

export const parseData = (ab: ArrayBuffer): WorkBook | PartialParsingFunction => {
  const data = new Uint8Array(ab);

  // Since we only support `.xlsx` and `.xls` formats right now, and
  // `opts.sheets` and `opts.getPartialResultFn` is only supported for
  // `.xlsx` we can safely omit `opts.sheets` on the first parse since it
  // doesn't matter - parsing `.xls` will parse the whole workbook anyway
  // and parsing `.xlsx` will return a `PartialParsingFunction`.
  const opts: ParsingOptions = {
    ...SJSreadOpts,
    type: 'array',
    getPartialResultFn: true,
    limitNumberOfSheets: 100,
    throwCustomErrorOnPasswordProtected: true,
    limitEmbeddedCount: 150
  };

  return read(data, opts);
};

