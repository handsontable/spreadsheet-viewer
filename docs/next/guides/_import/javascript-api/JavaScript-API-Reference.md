Spreadsheet Viewer comes with an official JavaScript API, which is used to instantiate and control the Spreadsheet Viewer's iframe from your JavaScript app.

The JavaScript API is very easy to use. As a developer, integrating Spreadsheet Viewer into your app, you need to prepare a DOM node that is a container the viewer and pass a reference to that node to the function `SpreadsheetViewer`. When the promise returned by `SpreadsheetViewer` is resolved, you can use helper methods to pass a spreadsheet file to the viewer and observe interaction events.

Usage of the JavaScript API is presented in the Quick Start examples included in the Spreadsheet Viewer [[ZIP package|Installation]].

If you wish to support IE11, it is recommended to transpile the JavaScript API module with a bundler like Webpack or Parcel. The bundler will replace the ES module import with a method that works in your setup. Your project should be configured to include two polyfills for IE11: `Promise` and `Object.assign`. The Angular, React and Vue quick start examples work in IE11 thanks to the bundler that adds these polyfills.

---------

# JavaScript API Reference

## SpreadsheetViewer(configuration)

`function SpreadsheetViewer(configuration): Promise<SpreadsheetViewerInstance>`

The basis of the JavaScript API is the `SpreadsheetViewer` function that takes a `configuration` object as the parameter, sets up the `container` DOM object to receive Spreadsheet Viewer's events and returns a promise of a `SpreadsheetViewerInstance` object.

The `configuration` object describes the environment in which the Spreadsheet Viewer iframe will be installed. It contains the following properties:

- `container` - Required. A DOM element (preferably an empty div), where the Spreadsheet Viewer iframe will be injected. This DOM element can be styled upon your liking. It will be fully filled with a borderless iframe.
- `assetsUrl` - Required. A URL to the [[frame assets]] entry point. We recommend using absolute URLs. If a relative URL is provided, we will use your app's window URL as the base. If the URL is incorrect, you will see an `Initialization timeout` error in the browser console. Typically the value ends with `/spreadsheet-viewer/sv/index.html`, as this is where this file can be found within the release ZIP package, however, the full path depends on your deployment. To set any of the [[feature flags|Query String API]], add the flags parameter at the end of the URL, e.g. `/spreadsheet-viewer/sv/index.html?flags=moreformats`.

The return value is a promise that resolves with a `SpreadsheetViewerInstance` object when the [[frame assets]] are fully loaded and available for use.

Before the promise is resolved, the iframe displays a static loading screen and rejects any communication from the host app.

_Note about cold vs hot start._ We call it a "hot start" if you keep the iframe hidden until the promise is resolved, or a "cold start" if you display the iframe before the promise is resolved. The Quick Start examples on the [[Installation]] page and in the ZIP package demonstrate a "cold start" because it is simpler, however the user experience is arguably superior with a "hot start".

Example:

```js
import { SpreadsheetViewer } from './clientLibrary';

SpreadsheetViewer({ 
  container: document.querySelector('div#spreadsheet-viewer'), 
  assetsUrl: '/spreadsheet-viewer/sv/index.html'
})
  .then(instance => {
    instance.configure({
      licenseKey: 'evaluation' // contact us to order a license key for commercial use beyond evaluation
    })
    instance.loadWorkbook('/example.xlsx', 0); // also available: loading from Base64 and ArrayBuffer
  })
  .catch(error => {
    console.error(error.message);
  });
```

## SpreadsheetViewerInstance

The `SpreadsheetViewerInstance` interface defines methods used to trigger request messages to the iframe.

### Methods

You can call these methods directly on the `SpreadsheetViewerInstance` object.

#### configure({ themeStylesheet, licenseKey })

Request message that reconfigures up the internal state of the Spreadsheet Viewer iframe in the runtime.

The only argument is an object with the following properties:

- `themeStylesheet`: Optional. A string representing the name of the built-in theme (color scheme) which can be either `light` or `dark`. Default value: `dark`
- `licenseKey`: Optional. A string representing Spreadsheet Viewer license key. Default value: empty string (meaning: unlicensed)

#### loadWorkbook(workbook, sheet, fileName)

Request message to Spreadsheet Viewer to render a file from a URL or a representation of the file in memory. While loading and parsing the workbook file, Spreadsheet Viewer displays an animated loading screen.

Arguments:

- `workbook`: Required. Should be one of the following:
   - (type: `string`) A URL to a workbook file. Spreadsheet Viewer will download and render the file. We recommend using absolute URLs. If a relative URL is provided, we will use `assetsUrl` as the base.
   - (type: `ArrayBuffer`) An array buffer with the file contents. Spreadsheet Viewer will render the file.
   - (type: `string`) Base64-encoded [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) representing the file contents. Spreadsheet Viewer will base64-decode and render the file.
- `sheet`: Required. A number, starting from 0, representing the index of the sheet within the document that will be open after the file loads.
- `fileName`: Required if `workbook` is an `ArrayBuffer`, otherwise optional. A string representing a file name of the current workbook. If the file name is not provided and `workbook` is an HTTP(S) URL, the app considers the last segment of the URL as the file name (after the last `/`). Otherwise, if the file name cannot be determined, the app will show "Unnamed file" as the file name.

#### selectCells(range)

Selects the given cells in the current workbook.

Note: Currently, this method does not work if it is called before a workbook has been loaded. Wait for `activeSheetChanged` event before calling this method (issue 473).

Arguments:

- `range` - Required. `[number, number, number, number]` - `[startRow, startCol, endRow, endCol]`. Specifies a range of the cells to be selected.

### Spreadsheet Viewer's events

Once the Spreadsheet Viewer instance is available for use, you can catch the events listed below using the [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) interface on the `container` DOM element.

#### activeSheetChanged

Event emitted when a sheet is changed by the end-user. 

The event has a `detail` property, which is an object with the following property:

- `sheet` - a `number`, starting from 0, representing the index of the sheet within the document

#### selectionDetails

Emitted when a selection is made in the data grid.

Properties:
- `name` - `"cellSelectionChanged"`
- `range` - `[number, number, number, number]` - coordinates of the selection

#### keydown

A re-exported event from the iframe when a key is pressed down.

Properties:
- `name` - `"keydown"`
- `key` - [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)

#### keyup

A re-exported event from the iframe when a key is released.

Properties:
- `name` - `"keyup"`
- `key` - [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)

#### drop

A re-exported event from the iframe when a file (or files) are dropped on the Spreadsheet Viewer window.

Properties:
- `name` - `"drop"`
- `files` - [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/FileList)

#### dragover

A re-exported event from the iframe when something (for example, a file) is dragged over the Spreadsheet Viewer window.

Properties:
- `name` - `"dragover"`

#### dragleave

A re-exported event from the iframe when something (for example, a file) stops being dragged over the Spreadsheet Viewer window (usually used together with the `dragover` event)

Properties:
- `name` - `"dragleave"`