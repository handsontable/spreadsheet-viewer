# Purpose of the files

### `cell-formats` and `charts` directory

These directories contain test files created for the purpose of checking compatiblity with Cell Formatting and Charts features in Excel. Source for these files and additional commentary: <https://drive.google.com/drive/u/0/folders/1-MfnEWTRLBz3PBIJBZjzTWwRZndolbQU>

### 101-sheets.xlsx

An empty xlsx file with 101 sheets inside. Used to test the sheet limit.

### borders.xlsx

Tests border styles and configurations for different combinations of color, width and direction of a border.

### broken.xlsx

This file is (binary speaking) the first half of empty.xlsx. Meant to test parser errors.

### chart-sheet.xlsx

Demonstrates Excel's feature of "chart sheets", in which a sheet does not contain any rows or columns, but only a single sheet.

### charts.xls

Test all chart types: column (2d column, 3d column, 2d bar. 3d bar), line (2d line, 3dline, 2d area, 3d area), statistical (histogram, box and whisker), waterfall (waterfall, funnel, stock, surface, radar), pie (2d pie, 3d pie, doughnut), XY (scatter, bubble), combo, map, sparkline. One tab tests different styles of chart formatting.

### charts.xlsx

Test all chart types: column (2d column, 3d column, 2d bar. 3d bar), line (2d line, 3dline, 2d area, 3d area), statistical (histogram, box and whisker), waterfall (waterfall, funnel, stock, surface, radar), pie (2d pie, 3d pie, doughnut), XY (scatter, bubble), combo, map, sparkline. One tab tests different styles of chart formatting.

### cell-types.xlsx

Various types of cell formatting: text, integer, floating point, currency, date, time, percent.

### custom-color-palette.xlsx

Tests custom color palettes.

### custom-default-sizes.xlsx

Tests custom size set for all columns and rows.

### custom-sizes.xlsx

Tests custom sizes of the columns and rows.

### empty.xlsx

The simplest, small XLSX file used when you want to load a file quickly.

### empty.xltx

Same as `empty.xlsx`, but with a different extension.

### empty-libreoffice.xlsx

The simplest, small XLSX file created under libreoffice used when you want to load a file quickly and determine support for libreoffice.

### empty-3-sheets.xlsx

An empty file, with three empty sheets.

### edge-case-with-cells-background.xlsx

The file tests the correct cell background. There is an edge case when switching from the first to the second tab, that cells B1, D1, E1 from the second tab had white color instead of orange.

### functions.xlsx

Tests Excel functions (reference, addition, subtraction, multiplication, division, sum).

### gridline.xlsx

Contains different combinations of gridlines, backgrounds, borders and frozen panes when gridlines are OFF or ON for a sheet.
Gridlines are turned off in the first sheet "Disabled" and 4th "Frozen Pane".
Additionaly this file is used to test cells selection.

### hidden-and-frozen-columns.xlsx

Has three sheets, all of which contain combinations of hidden columns and frozen panes (inside, outside and around the frozen line).

### hidden-and-frozen-rows.xlsx

Has four sheets, all of which contain combinations of hidden rows and frozen panes (inside, outside and around the frozen line). The last sheet is also an exercise for horizontal text overlapping, because there are many long texts but also many stop words.

### hidden-rows-and-columns.xlsx

Tests hidden columns and hidden rows feature.

### languages-and-chars.xlsx

Tests different languages chars.

### line-heights-vertical-alignment.xlsx
Tests line-height with different font size and vertical alignment. It is expected that the text positions in sheet pairs (0 and 1) and (2 and 3) will match, despite the sheets 1 and 3 being rendered with horizontal text overlapping.

### line-space.xlsx
Tests line-height (aka line space) with different font family, font size and vertical alignment.

### merged-cells.xlsx

Tests "merged cells" behaviour and text inside the cells.

### merged-and-frozen.xlsx

Has seven sheets, all of which contain combinations of merged cells and frozen columns (inside, outside and around the frozen line).

### objects.xlsx

Tests different positions of the inserted objects in cells.

### objects-151.xlsx

File contains 151 embedded objects. Should render max 150 embedded objects.

### objects-and-frozen.xlsx

Has seven sheets, all of which contain combinations of floating objects (images) and frozen columns (inside, outside and around the frozen line).

### objects--charts-and-frozen.xlsx

Has seven sheets, all of which contain combinations of floating objects (charts) and frozen columns (inside, outside and around the frozen line).

### floating-box-merged-cells.xlsx

Tests floating box position when the file contains merged cells and long wrapped text within merged cells.

### password-hot.xlsx

Password protected file, used to test password protection error. Also available in an `.xls` flavor. Password is "hot".

### row-column-border.xlsx

This spreadsheet has only one feature: a border around a whole row in one sheet, a border around a whole column in another sheet. There are deliberately no other features, to make sure that we test this feature on top of empty cells.

### row-column-fill.xlsx

This spreadsheet has only one feature: a fill inside a whole row in one sheet, fill inside a whole column in another sheet. There are deliberately no other features, to make sure that we test this feature on top of empty cells.

### sheet-row-column-styling.xlsx

Tests common formatting (border, fill, font) applied on the level of sheet, row and column.

The whole sheet was formatted with Arial 12pt, light yellow fill, 2px dark yellow border.

Then, the rows 3-6 were formatted with Calibri 12pt, light blue fill. After that, the rows 4-5 were given 1px dark blue border.

Then, the columns C-F were formatted with Times New Roman 12pt, light red fill. After that, the columns D-E were given 1px dark red border.

Then, the cell range E5:F6 was formatted with Arial 12pt italic, light green fill, 1px dark green border.

Then, the cells H4, H8, C10 were given font size 30pt and were deliberately left without text.

### styling.xlsx

Tests different font formatting (font family, font size, bold text, italic text, underlined text, font color),
alignment and indentation (many levels of indentation, wrapped text), border formats and background formats.

### table.xlsx

Used to test support for excel tables.\
Contains three sheets, each sheet has multiple tables. Each table represents different excel table style.

### table-border.xlsx

Contains a table with custom background and borders in some cells.

### table-customized.xlsx

Used to test support for excel tables options.\
Contains multiple tables, each table has different table options applied. In each row of tables, different combination of options is applied.\
DISCLAIMER:
In excel table, it is possible to define average row, which uses formula. This formula could be extracted from xlsx file, but values in column cells are already calculated, so theres no point to calcumate them. Thats why js-xlsx does not extract this information.

### tab-names.xlsx
Tests the longest and the shortest tab names. The longest tab title should be cut and ended with 3 dots (eg: This is very very long tab title and...).

### text-alignment.xlsx

Examples of various horizontal and vertical text alignment, combined with text wrapping.

### trim-empty-rows.xlsx

Tests trimming unwanted additional rows (previously the file rendered 1000 rows).

### embeds.xlsx

Contains embedded images, one type per worksheet: gif, svg, jpeg, png.
The png image is single image embedded twice. This creates an edge case of single drawing being embedded twice, thus producing two relations for the same drawing object, inside worksheet.

### limits--merged-column.xlsx

Test preserving merged column displaying property and limits are kept.

### limits--merged-row.xlsx

Test preserving that merged row displaying properly and limits are kept.

### _limits--merged-row-and-column.xlsx (not working, bug: out-of-memory)

Test preserving that merged row-and-column displaying properly and limits are kept.

### _limits--merged-column-content.xlsx (not working, bug: Cypress screenshot() often times out after 60s)

Test preserving that merged column content displaying properly and limits are kept.

### limits--merged-row-content.xlsx

Test preserving that merged row content displaying properly and limits are kept.

### _limits--merged-row-and-column-content.xlsx (not working, bug: out-of-memory)

Test preserving that merged row and column content displaying properly and limits are kept.

### limits--columns-over-limit.xlsx

Test preserving that columns over limit displaying properly and limits are kept.

### limits--rows-over-limit.xlsx

Test preserving that rows over limit displaying properly and limits are kept.

### _limits--rows-and-columns-over-limit.xlsx (not working, bug: out-of-memory)

Test preserving that rows and columns over limit displaying properly and limits are kept.

### stress-charts.xlsx

This file contains contents of `charts.xlsx` - multiplied enough times for stress testing in perf benchmarks.

### content-area.xlsx

This file contains filled and bordered rows and columns that exceed [content area](https://github.com/handsontable/spreadsheet-viewer-dev/wiki/Displayed-cell-range#content-area) of 20 rows and 6 columns.

### stress-embeds.xlsx

This file contains contents of `embeds.xlsx` - multiplied enough times for stress testing in perf benchmarks.

### stress-formats.xlsx

This file contains contents of `text-alignment.xlsx`, `borders.xlsx`, `merged-cells.xlsx`, `table-customized.xlsx`, - multiplied enough times for stress testing in perf benchmarks.

### _stress-formats-charts-embeds.xlsx

This file contains contents of `text-alignment.xlsx`, `borders.xlsx`, `merged-cells.xlsx`, `table-customized.xlsx`, `charts.xlsx`, `embeds.xlsx` - multiplied enough times for stress testing in perf benchmarks.

It currently does not render all charts and embeds and this problem will be investigated.

### _styles--pivot-tables.xlsx

Contains all pivot table's styles. Currently pivot tables are not supported - for more details please see https://github.com/handsontable/spreadsheet-viewer-dev/issues/359 .

### short-text-Arial-22-as-default-font-excel-win.xlsx

**Currently doesn't not work properly, it has 64px instead of correct value which should be parsed from file [see issue #517](https://github.com/handsontable/spreadsheet-viewer-dev/issues/517)**

It has Arial size 22 as the default font and a short text in B2. Created in Excel/Windows. Used to exemplify column widths.

### short-text-default-width-100-excel-mac.xlsx

It has Calibri size 12 as the default font (default on Excel/Mac), a short text in B2, and the default column width of 100px. Created in Excel/Mac. Used to exemplify column widths.

### short-text-default-width-100-excel-mac2win.xlsx

It has Calibri size 12 as the default font (default on Excel/Mac), a short text in B2, and the default column width of 100px. Created in Excel/Mac, later opened and saved in Excel/Windows. Used to exemplify column widths.

### short-text-default-width-100-excel-win.xlsx

It has Calibri size 11 as the default font (default in Excel/Windows), a short text in B2, and the default column width of 100px. Created in Excel/Windows. Used to exemplify column widths.

### short-text-menlo-20-as-default-font-excel-mac.xlsx

**Currently doesn't not work properly, it has 64px instead of correct value which should be parsed from file [see issue #517](https://github.com/handsontable/spreadsheet-viewer-dev/issues/517)**

It has Menlo size 20 as the default font (doesn't exist on Windows) and a short text in B2. Created in Excel/Mac. Used to exemplify column widths.

### short-text-menlo-20-as-default-font-excel-mac2win.xlsx

**Currently doesn't not work properly, it has 64px instead of correct value which should be parsed from file [see issue #517](https://github.com/handsontable/spreadsheet-viewer-dev/issues/517)**

It has Menlo size 20 as the default font (doesn't exist on Windows) and a short text in B2. Created in Excel/Mac, later opened and saved in Excel/Windows. Used to exemplify column widths.

### short-text-width-200-excel-mac.xlsx

**Currently doesn't not work properly, it has 64px instead of correct value which should be parsed from file [see issue #517](https://github.com/handsontable/spreadsheet-viewer-dev/issues/517)**

It has Calibri size 12 as the default font (default on Excel/Mac) and a short text in B2. Column C has 200px width. Created in Excel/Mac. Used to exemplify column widths.

### short-text-width-200-excel-win.xlsx

It has Calibri size 11 as the default font (default on Excel/Windows) and a short text in B2. Column C has 200px width. Created in Excel/Windows. Used to exemplify column widths.

### unsupported.txt

A text file used to check proper filetype validation.

### unsupported-invalid.bin

A binary file with random bytes used to force js-xlsx to throw.

### disguised-xlsx.ods

An xlsx file, but with a .ods extension.

### disguised-broken.ods

Same as broken.xlsx, but with a .ods extension.

### multi-line-merged-cells.xlsx

Regression test for checking whether the whole height of a workbook was getting rendered when there were merged cells with multi line text present inside. See https://github.com/handsontable/spreadsheet-viewer-dev/issues/445

### alignment-to-center-with-word-wrap.xlsx

Created for purpose to proof that text alignment to center works properly for cells with wrap text turned on. 

### leading-spaces-with-and-without-word-wrap.xlsx

Created for purpose to proof that leading spaces works properly with and without word wrap.

### sample-file.xlsx

This file is used as a sample on SV landing page and in Quick Start examples.

### currency-accounting-custom-format.xlsx

There are "currency", "accounting" and "custom" number formats.
