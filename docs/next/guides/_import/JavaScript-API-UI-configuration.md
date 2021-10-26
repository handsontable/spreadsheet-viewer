The appearance of Spreadsheet Viewer can be configured using some methods in the JavaScript API.

### Themes

By default, Spreadsheet Viewer uses a dark theme. You can explicitly load a theme of your liking using the `themeStylesheet` property of the object passed to the `configure` method:

Set `themeStylesheet: 'light'` to explicitly use the light theme:

> - JS: https://codesandbox.io/s/light-theme-in-1-0-0-locally-javascript-api-in-plain-js-2fbvx?file=/index.js
> - Angular: TBD
> - React: TBD
> - Vue: TBD

> Screenshot of the light theme

Set `themeStylesheet: 'dark'` to explicitly use the dark theme:

> - JS: https://codesandbox.io/s/dark-theme-in-1-0-0-locally-javascript-api-in-plain-js-nrbvn?file=/index.js
> - Angular: TBD
> - React: TBD
> - Vue: TBD

> Screenshot of the dark theme

### File name information

Spreadsheet Viewer presents the name of the workbook file in the top left corner of the viewer. We try to deduct this name automatically from the ending of the workbook URL. However, if the URL does not end with the file name, you might choose to provide the file name using the `fileName` property of the object passed to the `loadWorkbook` method:

For example, the below example explicitly sets the presented file name to be "Different file name", because that name is not contained in the workbook URL.

> - JS: https://codesandbox.io/s/file-name-in-1-0-0-locally-javascript-api-in-plain-js-hln1q?file=/index.js
> - Angular: TBD
> - React: TBD
> - Vue: TBD

> Screenshot of the custom file name