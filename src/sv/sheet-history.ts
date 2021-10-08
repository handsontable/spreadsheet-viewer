/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define */

import * as nonEmptyArray from './non-empty-array';

// This type is used by the `useWorkbook` to provide a nice experience when
// switching around tabs. See comments in `src/sv/use-workbook` for details.

// Having this Symbol both not exported and `unique` ensures that we can only
// create values of this type in this file.
const $symbol: unique symbol = Symbol('sheet history');

// Internal types
type GetLatestLoadedSheet = (loadedSheets: number[]) => number | undefined;
type SelectSheet = (sheet: number) => SheetHistory;
type Sheets = nonEmptyArray.NonEmptyArray<number>;

// Public types
export type SheetHistory = {
  // Internal properties
  $symbol: typeof $symbol

  // Computed properties
  latestSheet: number

  // Instance methods
  getLatestLoadedSheet: GetLatestLoadedSheet
  selectSheet: (sheet: number) => SheetHistory
};

// Internal API
const _from: (sheets: Sheets) => SheetHistory = data => ({
  $symbol,
  latestSheet: _getLatestSheet(data),
  getLatestLoadedSheet: _getLatestLoadedSheet(data),
  selectSheet: _selectSheet(data)
});

const _getLatestLoadedSheet = (sheets: Sheets): GetLatestLoadedSheet => loadedSheets => sheets.findLast(n => loadedSheets.includes(n));
const _getLatestSheet = (sheets: Sheets): number => sheets.last();
const _selectSheet = (sheets: Sheets): SelectSheet => sheet => _from(sheets.append(sheet));

// Public constructors
export const init = (sheet: number): SheetHistory => {
  const sheets: Sheets = nonEmptyArray.init(sheet);

  return {
    $symbol,
    latestSheet: _getLatestSheet(sheets),
    getLatestLoadedSheet: _getLatestLoadedSheet(sheets),
    selectSheet: _selectSheet(sheets)
  };
};
