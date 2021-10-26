All parameters in Query String API are optional.

Parameter | Description
------|------
`workbookUrl` | A URL to a workbook file. It must be an HTTP or HTTPS URL. Note: Data URL nor ArrayBuffer are not supported in the Query String API, however, they are supported in [JavaScript API](JavaScript-API-Reference) and [Web Messaging API](Web-Messaging-API-Reference). We recommend using absolute URLs. If a relative URL is provided, we will use the frame URL as the base.
`licenseKey` | A string representing Spreadsheet Viewer license key. Default value: empty string (meaning: unlicensed)
`sheet` | optionally, a number, starting from 0, representing the index of the sheet within the document that will be open after the file loads. Default value: `0`
`themeStylesheet` | A string representing the name of the built-in theme (color scheme) which can be either `light` or `dark`. Default value: `dark`
`fileName` | A string representing a file name of the current workbook. If the file name is not provided and `workbookUrl` is an HTTP(S) URL, the app considers the last segment of the URL as the file name (after the last `/`). Otherwise, if the file name cannot be determined, the app will show "Unnamed file" as the file name.
`svId` | A string to be used as the unique identifier of the Spreadsheet Viewer instance. If unset, a random string will be created automatically before sending the first callback message by [Web Messaging API](Web-Messaging-API-Reference).
`flags` | Flags enable experimental features. Each flag should be separated by a comma `,`. See [Experimental feature flags](Query-String-API-Experimental-feature-flags) for details about the available flags.