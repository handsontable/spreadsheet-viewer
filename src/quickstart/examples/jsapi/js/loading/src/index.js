import { SpreadsheetViewer } from "tmpsv";

SpreadsheetViewer({
  container: document.querySelector("div#spreadsheet-viewer"),
  //assetsUrl: "https://unpkg.com/tmpsv@0.0.1/spreadsheet-viewer/sv/index.html", // ok
  assetsUrl:
    "https://cdn.skypack.dev/tmpsv@0.0.1/spreadsheet-viewer/sv/index.html" // ok
})
  .then((instance) => {
    instance.configure({
      licenseKey: "evaluation" // contact us to order a license key for commercial use beyond evaluation
    });
    instance.loadWorkbook(
      "https://tne.pl/github/spreadsheet-viewer-quickstart/common/workbooks/sample-file.xlsx",
      0
    ); // also available: loading from Base64 and ArrayBuffer
  })
  .catch((error) => {
    console.error(error.message);
  });
