The appearance of Spreadsheet Viewer can be configured using some parameters of the Query String API.

### Themes

By default, Spreadsheet Viewer uses a dark theme. You can explicitly load a theme of your liking using a parameter:

Set `themeStylesheet=light` to use the light theme, as in: https://app.example.com/spreadsheet-viewer/sv/index.html?licenseKey=demo&workbookUrl=https://files.example.com/workbook.xlsx&sheet=0&themeStylesheet=light.

> Screenshot of the light theme

Set `themeStylesheet=dark` to use the dark theme, as in: https://app.example.com/spreadsheet-viewer/sv/index.html?licenseKey=demo&workbookUrl=https://files.example.com/workbook.xlsx&sheet=0&themeStylesheet=dark.

> Screenshot of the dark theme

### File name information

Spreadsheet Viewer presents the name of the workbook file in the top left corner of the viewer. We try to deduct this name automatically from the ending of the workbook URL. However, if the URL does not end with the file name, you might choose to provide the file name using the `fileName` parameter.

For example, the URL https://app.example.com/spreadsheet-viewer/sv/index.html?licenseKey=demo&workbookUrl=https://files.example.com/file/123&sheet=0&fileName=workbook.xlsx explicitly sets the presented file name to be "workbook.xlsx", because that name is not contained in the workbook URL.

> Screenshot of the custom file name