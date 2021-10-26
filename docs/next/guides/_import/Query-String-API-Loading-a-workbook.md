The Query String API provides a way to set the initial state of Spreadsheet Viewer only using URL parameters. 

### When to use the Query String API

This API is the most useful when:

- you prefer adding HTML widgets rather than custom JavaScript in your project
- you want to load Spreadsheet Viewer in:
   - a new browser window
   - a web view within a native app
   - a headless browser 
   - a screenshot-making tool

### Integration with your web app

To make use of the Query String API, you need to know the URL at which the [[Frame assets]] are deployed on your server. You will load this URL, followed by a question mark `?`, and a set of URL-encoded query string parameters.

See the [[Quick start]] guide to see examples of using the Query String API in an `<iframe>` using plain HTML, React, Angular or Vue.

### Basic example of loading a workbook

For example, a URL https://app.example.com/spreadsheet-viewer/sv/index.html?licenseKey=demo&workbookUrl=https://files.example.com/workbook.xlsx&sheet=0 is composed of:

- `https://app.example.com/spreadsheet-viewer/sv/index.html` - the URL of the [[Frame assets]]
- `licenseKey=demo` - a parameter that provides a valid Spreadsheet Viewer license key
- `workbookUrl=https://files.example.com/workbook.xlsx` - a parameter that provides an absolute URL to a spreadsheet file. Since `files.example.com` is a different hostname than `app.example.com`, the HTTP response from `files.example.com` must include CORS headers (see [[Security]] for details).
- `sheet=0` - a parameter that instructs the viewer to show the first sheet within the file