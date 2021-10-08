import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import SpreadsheetViewer from './SpreadsheetViewer';

const App = () => (
  <>
    <div className="Header">
      <div className="container-lg clearfix col-12 px-3">
        <h1 className="text-white h1">Spreadsheet Viewer</h1>
        <p>1.0.0</p>
      </div>
    </div>

    <div className="container-lg clearfix px-3">

      <nav aria-label="Breadcrumb" className="mt-4">
        <ol>
          <li className="breadcrumb-item"><a href="../../../index.html">Home</a></li>
          <li className="breadcrumb-item" aria-current="page">React</li>
        </ol>
      </nav>

      <div className="pagehead mt-3 mb-3">
        <h2 className="h2">Integration example using React</h2>
      </div>

      <div className="markdown-body mt-4 mb-3">
        <p>
          In the below quick start example, a preview of a sample XLSX file is inserted into a DOM container using
          <a href="https://github.com/handsontable/spreadsheet-viewer/wiki/JavaScript-API">Spreadsheet Viewer JavaScript API</a>
          .
        </p>
      </div>

      <SpreadsheetViewer />

      <div className="markdown-body mt-4 mb-3">
        <h3>Source</h3>

        <p>
          Open the file
          <code>examples/react/src/SpreadsheetViewer.js</code>
          {' '}
          in your code editor to see the source code.
          To make changes to this example, edit the source code, then run the below commands and refresh the page:
        </p>

        <pre>
          <code>
            {`cd examples/react
npm install
npm run build`}
          </code>
        </pre>

        <p>
          The source code follows the
          <a href="https://github.com/handsontable/spreadsheet-viewer/wiki/Installation">Installation</a>
          {' '}
          guide, adjusted for React.
        </p>
      </div>

    </div>
  </>
);

ReactDOM.render(<App />, document.getElementById('app'));
