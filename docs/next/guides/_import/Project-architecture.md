The product's modular architecture consists of logical layers:

1. Controller
2. Parser
3. Interpreter
4. Presentation

## Controller

The controller layer operates at the entry point to the application and controls the passing of the data between the other layers. More specifically:

   - pass request messages to other layers
   - pass the result of the parser to the interpreter
   - pass the result of the interpreter to the presentation (React)

Location: `src/index.tsx`

## Parser

The parser layer is responsible for reading the supported file format's binary and converting it into a JSON representation.

Implemented using a fork of SheetJS with our modifications (https://github.com/handsontable/js-xlsx).

Key characteristics:

- parser runs in a Web Worker. Web Worker does not hang the browser's main thread, which allows drawing UI while parsing
- parser only parses the sheet that's desired to be shown
- no DOM operations (works in a Web Worker but might as well work in NodeJs)

Location: `src/sv/parse-worker`

## Interpreter

The interpreter layer converts the spreadsheet data into a Handsontable data grid settings object for each worksheet, including configuration for chart renderers (BizCharts).

Location: `src/sv/components/SpreadsheetContents/utils.tsx`

## Presentation

This layer defines the user experience of what's inside the viewer's `iframe`. It is implemented in React, but it integrates with any client-side framework of the host app thanks to the `iframe` isolation.

All the public interfaces of the viewer ([[Query String API|Query String API Reference]], [[JavaScript API|JavaScript API Reference]], [[Web Messaging API|Web Messaging API Reference]]) are implemented on this layer.

Location: `src/sv`

## Diagrams

### Communication diagram

![communication](/docs/next/img/communication.png)
