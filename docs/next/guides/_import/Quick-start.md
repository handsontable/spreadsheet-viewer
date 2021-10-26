This quick start guide introduces the possibilities of presenting the content of XLSX files within your web app using Spreadsheet Viewer.

### Choosing the API for your project

Spreadsheet Viewer comes ready with three different built-in APIs. In your project, you will choose and use one of the following APIs:

1. [[Query String API|JavaScript API Reference]] that uses an `<iframe>`, just like a YouTube embed. This API is used in this "Quick Start" guide. Use it when you need to set up a working app within an hour.
2. [[JavaScript API|JavaScript API Reference]] that uses JavaScript (ES6) and DOM events. Use it when you need more programmatic control over user interactions with the viewer.
3. [[Web Messaging API|Web Messaging API Reference]] that uses `postMessage`. Use it when you need to control the web browser from the outside.

# Installation

The quickest way to install Spreadsheet Viewer into your project is to use the builds provided in the ZIP package. The package file is called `SpreadsheetViewer.zip` and can be obtained from https://github.com/handsontable/spreadsheet-viewer/releases/tag/1.0.0.

1. Extract the ZIP package

   ```bash
   unzip -d SpreadsheetViewer SpreadsheetViewer.zip
   ```

2. Copy the build of the frame assets into the assets of your project exposed on a web server. This folder is usually called `public`, `static` or `assets`.

   ```bash
   cp -r SpreadsheetViewer/spreadsheet-viewer/sv <your-project-public-files>/spreadsheet-viewer/sv
   ```

When you deploy frame assets on your web server, they should be reachable by HTTP as static files. We will use that in the next step of this tutorial.

Please refer to the page [[Frame assets]] for additional deployment instructions. See the page [[Custom build]] to learn more about building the frame assets by yourself.

### Embed an XLSX file in your web app with a single line of code

If you followed the above installation instructions in the previous section, it should be possible to show a preview of an XLSX file by putting an `<iframe>` anywhere in your app or website with the certain URL parameters.

In the below example, use Spreadsheet Viewer's [[Query String API|Query String API Reference]]. This makes use of the URL parameters. It is the easiest to integrate with any web app, because it only uses the HTML `<iframe>` tag to contain Spreadsheet Viewer within your web app. If you need more programmatic control over the viewer, we also have two other APIs (more about that in the next section).

> - HTML: https://codesandbox.io/s/install-sv-1-0-0-locally-query-string-api-in-plain-html-o8okz
> - Angular: https://codesandbox.io/s/install-sv-1-0-0-locally-query-string-api-in-angular-vbnk3
> - React: https://codesandbox.io/s/install-sv-1-0-0-locally-query-string-api-in-react-4zzhm
> - Vue: https://codesandbox.io/s/install-sv-1-0-0-locally-query-string-api-in-vue-pcyui

The `href` attribute contains a URL with parameters of the Query String API. The most important parameter is `workbookUrl`. Its value is the URL of an XLSX file on your server. This and other configurable parameters are explained in the [[Query String API|Query String API Reference]] page.

The `style` attribute is used to control the width and height of the spreadsheet file preview in your layout.

If the frame assets or XLSX files are not available on the same hostname, some resources might be blocked by the web browser's security policy. In that case, setting up CORS on the server is usually enough to give access to these resources. Refer to the page [[Security]] for details about CORS and Content Security Policy.

### Customization and custom builds

The above tutorial discussed different ways to get started using Spreadsheet Viewer in your app. If you would like to change the appearance of the viewer, make sure to check the configuration options available in our APIs that allow you to set the theme stylesheet or hide some buttons.

For more complex scenarios, it is possible to completely customize the viewer by making a [[Custom build]].