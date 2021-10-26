💁 We encourage the customers to use the [[Query String API]], or the [[JavaScript API]] if they integrate Spreadsheet Viewer with an app that is implemented in JavaScript or TypeScript.

-------

Spreadsheet Viewer is designed to be used in an iframe or a window and be controlled from the outside code. For that, it implements a low-level Web Messaging API ([see the MSN docs about `postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)), a cross-document messaging interface defined in the HTML standard.

This interface allows controlling Spreadsheet Viewer using `postMessage` from another frame. It can potentially be used with programming languages other than JavaScript that can communicate with a browser window or a web view.

This API is asynchronous with bidirectional messaging. One direction is referred to as "request messages" (from host to SV), the second direction is referred to as "callback messages" (from SV to host). 

There is one mandatory property in a request message: `name`. There are two mandatory properties in a callback message: `name` and `svId`. Other properties are used to carry the details of the message.