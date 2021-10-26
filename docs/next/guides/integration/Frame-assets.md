Throughout this documentation, we use the term "frame assets". By this, we mean either:

- a default build of the Spreadsheet Viewer app that is distributed in the `spreadsheet-viewer/sv` subdirectory of the release ZIP package
- a customized build of the Spreadsheet Viewer app (see [[Customization]])

## Entry file and other contents

The following screenshot shows the list of all frame assets contents as of the version 1.0.0:

![frame assets](/docs/next/img/frame_assets.png)

Among these files, `index.html` is worth noting as the **frame assets entry point**. This file is important because it is an entry point of all our APIs:

- if you are using [[JavaScript API|JavaScript API Reference]], `assetsUrl` must be a URL to this file
- if you are using [[Web Messaging API|Web Messaging API Reference]], this is the file that you must load in a frame or window in order to send and receive messages
- if you are using [[Query String API|Query String API Reference]], this is the file to which you will add parameters using an HTTP query string

You can recognize this entry point `index.html` by the fact that when accessed directly, it displays a rather dull "Hello, developer!" message as presented by the below screenshot. Don't worry, this message is not visible when any of the above APIs is used.

![frame assets index.html](/docs/next/img/frame_assets_index_html.png)

Other files include CSS (stylesheets for the presentation layer), JS (scripts for the parser, interpreter, and presentation layers), WOFF and WOFF2 (web fonts).

## Deployment

Spreadsheet Viewer frame assets can be deployed onto any static file web server, by simply copying the whole `sv` folder, as demonstrated in the [[Installation]] instructions.

If the assets are served from a different origin (for strict security), make sure that the server includes proper CORS headers. Refer to the [[Security]] page for details.

## Caching headers

All file names, except for the entry point (`index.html`), are content-hashed. This means that the file names contain hashes derived from the file content and it is encouraged to use aggressive HTTP caching headers with the `css`, `js`, `woff`, `woff2` files. For example:

```
Cache-Control: max-age=31536000
```