### Error codes in use

Possible error codes that the end-user can see on the crash screen:

|Error code|Description|
|----------|-----------|
| `UNSUPPORTED_FILE_FORMAT_ERROR` | Thrown when an unsupported type of file has been passed in to the viewer. This check is based either on `fileName` or, in case of a url and when `fileName` was not provided, the mime returned by the server that served the file. |
| `UNSUPPORTED_WORKBOOK_FORMAT_ERROR` | Thrown when the provided file was considered a workbook, but isn't supported yet. Provide the `moreformats` flag to parse it anyway, though note that support for files covered by that flag is experimental. |
| `FILE_SIZE_ERROR` | If the provided `ArrayBuffer`, or downloaded file is over 10 MB. |
| `PARSER_ERROR` | An error was thrown in the parser, due to an invalid file. |
| `INTERPRETER_ERROR` | The interpreter that translates the parsed data model into settings for the on-screen components threw an error. |
| `RENDER_ERROR` | The data grid component failed rendering the interpreted configuration. |
| `FILE_LOADING_STATUS_ERROR` | The server returned a non-200 status code for the workbook request.
| `FILE_LOADING_TIMEOUT_ERROR` | File has been downloading for longer than 30 seconds. |
| `FILE_LOADING_MIME_TYPE_ERROR` | A file has begun downloading, but the supported `content-type` header doesn't match any of the supported mime types. |
| `FILE_LOADING_NETWORK_ERROR` | Any network error that caused the file download to fail. If you are loading the XLSX file from a different HTTP hostname than the [[Frame assets]], this error might be caused by CORS. Refer to the [[Security]] page for details related to CORS.
| `FILE_PROTECTION_ERROR` | Shown when the user tried to load a password-protected file. This feature is not supported yet
| `WORKER_CACHE_INTEGRITY_ERROR` | Internal error for when worker's file cache fails to work as expected. Should never be thrown but is used as a sanity check. |
| `SHEET_LIMIT_ERROR` | Shown if a workbook with over 100 sheets was passed to the app. |
| `INVALID_REQUEST_MESSAGE_ERROR` | Shown if a [Web Messaging API](Web-Messaging-API-Reference) request message with an invalid format was sent to the app. |
| `INVALID_QUERY_STRING_API_PARAMETER_ERROR` | Shown if [Query String API](Query-String-API-Reference) parameters are invalid. |
| `UNKNOWN_ERROR` | Any other error that gets thrown in the app. |
