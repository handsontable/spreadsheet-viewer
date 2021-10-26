Some of the features planned for the future versions of Spreadsheet Viewer can be tested earlier by enabling feature flags. 

Warning! The experimental features are not intended for production use. Rather, we make them available to collect feedback for future improvements. If you're interested in one of the experimental features, please contact us for details about our plans for further development.

To enable one of more experimental features in JavaScript API, add the `flags` parameter to the `assetsUrl` property of the constructor function. Every feature is identified by a short name, also known as a "flag". 

When providing more than one flag, separate the flags using a comma (`,`).

The below example enables all currently available experimental features.

> - JS: https://codesandbox.io/s/feature-flags-in-1-0-0-locally-javascript-api-in-plain-js-l4624?file=/index.js
> - Angular: TBD
> - React: TBD
> - Vue: TBD

### Available feature flags

Flag Name | Description
----------|-------------
`charts` | Enable parsing and displaying charts. Current version of chart feature is far from ideal and marked as experimental.
`fullPage` | Enables full page mode - only the grid will be displayed, without any UI around it (like the tab bar).
`moreformats` | Enables experimental support for more workbook formats, other than `xlsx` and `xltx`. The following additional filename extensions will be enabled for parsing: `.xls`, `.xla`, `.xlt`, `.xlsm`, `.xltm`, `.xlam`, `.xlsb`, `.ods`, `.numbers`.

