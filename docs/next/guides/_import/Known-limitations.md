As with any Web-based product, Spreadsheet Viewer’s performance is limited by the network, the client’s hardware and the Web browser engine. It is possible that some client configuration combinations will result in poor performance or inability to render the file. In that case, Spreadsheet Viewer will do its best to fall back gracefully and present the user with an option to download the file.

Our team is dedicated to investigate any failures and improve the product in the subsequent releases.

Below is a list of known limitations that are not considered bugs.

### Globalization

The numbers and dates are displayed using English (United States) locale.

User interface is in English.

### Formulas

Spreadsheet Viewer does not recalculate the formulas used in a workbook file. Rather, it displays the formula results that were stored in the file at the time of saving. 

Note that the calculated result of the **date and time** functions that we can find in the XLSX file is different to what you can see when reopening the file in Excel. For example, the stored calculated result of the function `TODAY` is the date when the file was last saved. So, if a file was last saved on January 1st, 2019, opening it in Spreadsheet Viewer will show `1-Jan-19` in place of the `=TODAY()` formula, while opening it in Excel will show the current date.

Some XLSX generators (e.g. `xlsx-populate`) do not include the calculated result of the formulas in the generated XLSX files. In that case, Spreadsheet Viewer shows an **empty cell** or a formatted value based on zero input (e.g. `1/0/00` for `=TODAY()`). We recommend using an XLSX generator that can properly include the result of the formula in the file, or processing your generated files with a converter that can fix that. For example, the command `soffice.exe --convert-to xlsx file.xlsx --outdir outdir --headless` uses LibreOffice to load `file.xlsx` and save it as `outdir/file.xlsx` while fixing the calculation result.

### Zoom

Currently, Spreadsheet Viewer does not have a UI control for zoom. However, browser-controlled page zoom works, as presented on the screenshot below. Customers must keep in mind that page zoom is applied to the top application frame. To allow page zoom, the top application RWD configuration (`<meta viewport="...">` tag) must be undefined or defined in a way that allows user scalable pages. Specifically, avoid `user-scalable="no"`, keep `maximum-scale` value 2 or higher, and `minimum-scale` at 0.5 or less. This is in line with [WCAG 2.0 success criterion 1.4.4](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-scale.html).

Screenshot: Spreadsheet Viewer at page zoom level 300%.

![](https://user-images.githubusercontent.com/566463/97979915-400e1580-1dd0-11eb-9cec-de18808f4979.png)

### Password protection

Password protected workbooks are not supported. An attempt to preview a password-protected workbook shows a crash screen.

### Number of columns and rows

Spreadsheet Viewer renders at least 20 rows and at most 10000 rows. This is configurable using the properties: `LOWER_GRID_LIMIT_ROWS`, `UPPER_GRID_LIMIT_ROWS`.

We render at least 6 columns and at most 256 columns. This is configurable using the properties: `LOWER_GRID_LIMIT_COLUMNS`, `UPPER_GRID_LIMIT_COLUMNS`. Be careful when increasing the upper limitation, because it causes the application to consume a lot of memory when the workbook contains default styles for all columns (issue #508).

### Download

The download button is not provided in:

- Internet Explorer
- some browsers other than Safari in iOS 14 (for example Chrome)
- iOS 12 and earlier

### Sheets

Spreadsheet Viewer is configured to display the crash screen if the workbook contains more than 100 sheets.

### Hidden rows and columns

Hidden rows and columns are displayed as regular rows and columns.

### Fonts

If the user's system does not have a font installed, some fonts are substituted with their metric-compatible open source  font equivalents, loaded as Web fonts:

- Arial → Liberation Sans
- Times New Roman → Liberation Serif
- Courier New → Liberation Mono
- Calibri → Carlito
- Cambria → Caladea

Other fonts fall back to Arial/Liberation Sans font in they are not present in the user's system.

### Frozen panes

The line at the edge of a frozen pane is not rendered correctly if the pane ends with a merged cell (https://github.com/handsontable/handsontable/issues/6957).

To increase the available screen area, the frozen panes feature is disabled on mobile devices.

### Embedded objects

There is a limit in Spreadsheet Viewer of the embedded objects (charts, images) as 150 per workbook. If the workbook contains more than 150 objects, the objects above the limit will not be rendered. 

### Experimental charts support

Charts support is considered experimental and is disabled by default. To enable it, add a feature flag to the URI: `index.html?flags=charts`

#### Markers
Some markers are simplified:

1. short and long bar markers are presented with single line and ignore marker background settings
1. asterisk marker would require two glyphs for front (cross and line). It is presented with a hexagon instead

#### 3D charts
All 3D charts variants (Line 3D, Area 3D, Bar 3D, Pie 3D) are presented with their 2D variants

#### Unsupported chart types
Following chart types are not supported (issue #65, #131):
* Treemap
* Sunburst
* Histogram
* Pareto
* Box and Whisker
* Waterfall funnel
* Map

#### Data labels
Example:
![](https://user-images.githubusercontent.com/6944137/67757480-2b1fd900-fa3c-11e9-830e-c4e380fa554c.png)

Data labels are currently not supported and they might leave blank space marks on the chart (issue #124)