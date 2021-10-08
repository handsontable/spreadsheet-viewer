let downloadAttributeSupport: boolean;

const isWkWebView = () => {
  if ((window as any).webkit?.messageHandlers) {
    return true;
  }
  return false;
};

/**
 * Feature-checks if the browser supports <a download> attribute
 * It reports no support in WkWebView for the reason described in https://github.com/handsontable/spreadsheet-viewer-dev/issues/922
 */
export const detectDownloadSupport = () => {
  if (downloadAttributeSupport === undefined) { // execute on first call, then cache
    downloadAttributeSupport = 'download' in document.createElement('a') && !isWkWebView();
  }

  return downloadAttributeSupport;
};
