import { Component, Input, OnInit } from '@angular/core';
import { SpreadsheetViewer } from '../../../../spreadsheet-viewer/client-library/clientLibrary';

@Component({
  selector: 'spreadsheet-viewer',
  template: '<div id="spreadsheet-viewer"></div>',
  styleUrls: ['spreadsheet-viewer.css']
})
/**
 * The `SpreadsheetViewerComponent` hasn't cover whole Spreadsheet Viewer API, for more information:
 * @see https://github.com/handsontable/spreadsheet-viewer/wiki/Guide-and-API%3A-Client-Library
 * @see https://github.com/handsontable/spreadsheet-viewer/wiki/Guide-and-API:-REST
 * @see https://github.com/handsontable/spreadsheet-viewer/wiki/Guide-and-API:-Web-Messaging
 */
export class SpreadsheetViewerComponent implements OnInit {
  /**
   * Contact us to order a license key for commercial use beyond evaluation
   */
  @Input() license: string;

  @Input() sheet: number;

  @Input() workbook: string;

  constructor() { }

  ngOnInit(): void {
    const { workbook, sheet, license } = this;
    SpreadsheetViewer({
      container: document.querySelector('div#spreadsheet-viewer'),
      assetsUrl: '/spreadsheet-viewer/sv/index.html'
    })
      .then((instance) => {
        instance.configure({
          licenseKey: license
        });
        instance.loadWorkbook(workbook, sheet);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

}
