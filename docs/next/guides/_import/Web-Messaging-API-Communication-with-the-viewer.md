Spreadsheet Viewer is designed for integration with any application. For that, the viewer accepts "request messages" from a host app and responds using "response messages". These messages are implemented using Web Messaging API (also known as Cross-Document Messaging API). 

For more information about this browser API, see:

- [MDN docs about `postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Wikipedia entry about Web Messaging](https://en.wikipedia.org/wiki/Web_Messaging)
- [Cross-document messaging in HTML Standard](https://html.spec.whatwg.org/multipage/web-messaging.html)

### When to use the Web Messaging API

For the convenience of a developer that integrates Spreadsheet Viewer with their web app, we recommend using [[JavaScript API|JavaScript API Reference]] instead of Web Messaging API.

However, Web Messaging API can be used when you need to:

- control Spreadsheet Viewer from a test framework. For example, with Cypress, it could be used as:
   ```js
    cy.visit('/sv/index.html?licenseKey=demo');
    cy.readFile(`cypress/fixtures/${fileNames.FILE_GENERAL}`, 'base64').then((rawContents) => {
      const dataURL = `data:application/vnd.ms-excel;base64,${rawContents}`;
      cy.window().then(($window) => {
        $window.postMessage({
          name: 'loadWorkbook',
          fileName: 'empty.xlsx',
          workbook: dataURL,
          sheet: 0
        });
      });
    });
   ```
- control Spreadsheet Viewer from a headless browser framework. For example, with Puppeteer, it could be used as:
   ```js
   await page.evaluate((data) => {
     window.postMessage({
          name: 'loadWorkbook',
          fileName: 'empty.xlsx',
          workbook: dataURL,
          sheet: 0
        }, '*');
   }, data);
   ```
- control Spreadsheet Viewer from a native app. For example, on Android you can use the [WebViewCompat](https://developer.android.com/reference/androidx/webkit/WebViewCompat) interface methods `addWebMessageListener` and `postWebMessage` to establish bi-directional communication with the web view.