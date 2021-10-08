// Dynamically set Webpack's publicPath to the correct place.
// *Requires the page URL to include a trailing slash*
//
// More information: https://github.com/handsontable/spreadsheet-viewer-dev/issues/605

// `/`                     -> `/`
// `/index.html`           -> `/`
// `/sv-dist/`             -> `/sv-dist/`
// `/sv-dist/index.html`   -> `/sv-dist/`
// `/a/b/c/d/e/f/fun.html` -> `/a/b/c/d/e/f/`

// eslint-disable-next-line @typescript-eslint/camelcase
__webpack_public_path__ = `${window.location.pathname.split('/').slice(0, -1).join('/')}/`;
