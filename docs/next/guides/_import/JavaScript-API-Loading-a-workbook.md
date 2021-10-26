The JavaScript API provides a way to control the state of Spreadsheet Viewer only using JavaScript (ES6) promises (or async functions) and DOM events. 

### When to use the JavaScript API

This API is the most useful when you keep your application logic in JavaScript and want to abstract away the fact, that it uses `<iframe>` and `postMessage` to communicate with your app. Instead, you will use asynchronous JavaScript calls from your application framework to load spreadsheet files into the viewer and track user interactions with it.

### Integration with your web app

To make use of the JavaScript API, you need to know the URL at which the [[Frame assets]] are deployed on your server. You will load this URL as the `assetsUrl` property of the configuration object passed to the constructor.

### Basic example of loading a workbook

For example, the following code loads a workbook into a `<div>` in your app:

> - JS: https://codesandbox.io/s/install-sv-1-0-0-locally-javascript-api-in-plain-js-puj7w
> - Angular: https://codesandbox.io/s/install-sv-1-0-0-locally-javascript-api-in-angular-xzc7r
> - React: https://codesandbox.io/s/install-sv-1-0-0-locally-javascript-api-in-react-4zzhm
> - Vue: https://codesandbox.io/s/install-sv-1-0-0-locally-javascript-api-in-vue-1ckrm

In the above code:

- `container` property contains a reference to an existing `<div>` container element in the DOM. An `<iframe>` element will be automatically created in the provided element.
- `assetsUrl` property contains the URL of the [[Frame assets]]
- `licenseKey` property provides a valid Spreadsheet Viewer license key
- `loadWorkbook` - a function call that loads a spreadsheet file using an absolute URL (`https://tne.pl/github/spreadsheet-viewer-quickstart/common/workbooks/sample-file.xlsx`). Since `files.example.com` is a different hostname than `app.example.com`, the HTTP response from `files.example.com` must include CORS headers (see [[Security]] for details). The second parameter (`0`) instructs the viewer to show the first sheet within the file.

### Compatibility

The JavaScript API works in all modern browsers. However, it requires a polyfill to run in IE11.

Note that this API uses the ES module syntax (`import`). If needed, it needs a transpiler in your app to work with CommonJS (`require()`).