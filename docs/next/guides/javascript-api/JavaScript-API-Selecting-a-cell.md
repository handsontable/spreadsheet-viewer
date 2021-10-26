Spreadsheet Viewers offers certain APIs to work on cell selection.

### Select a range of cells in the viewer

It is possible to set cell selection in Spreadsheet Viewer by calling the method `selectCells`, as in the below example:

> - JS: https://codesandbox.io/s/select-cells-in-1-0-0-locally-javascript-api-in-plain-js-2fbvx?file=/index.js
> - Angular: TBD
> - React: TBD
> - Vue: TBD

Note: As of version 1.0.0, this method does not work if it is called before a workbook has been loaded. In the above example, we wait for `activeSheetChanged` event and then 100 milliseconds before calling this method.

### Be informed when a user selects a range of cells

When the user selects a range of cells (or just a single cell), a `cellSelectionChanged` event on the container element is emitted. The `range` property of the event contains the coordinates of the selection.

For example:

> - JS: https://codesandbox.io/s/get-cell-selection-in-1-0-0-locally-javascript-api-in-plain-js-chtc0?file=/index.js
> - Angular: TBD
> - React: TBD
> - Vue: TBD