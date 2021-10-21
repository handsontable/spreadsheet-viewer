import React from 'react';

export const DeveloperWelcomeScreen = () => {
  return (
    <div className="developer-screen">
      <h1 className="developer-screen--title">Handsontable Spreadsheet Viewer</h1>
      <p>
        Hello, developer!
      </p>
      <p>
        You have successfully reached the frame assets of Spreadsheet Viewer. However, the integration is
        not done, because this document was not initialized by one of the APIs mentioned below.
      </p>
      <p>
        This app is intended to be run:
      </p>
      <ul>
        <li>
          with URL parameters, as explained in
          {' '}
          <a href="https://github.com/handsontable/spreadsheet-viewer/wiki/Query-String-API" target="_blank" rel="noopener noreferrer">
            Query String API
          </a>
        </li>
        <li>
          or, in an iframe driven by asynchronous messages, as explained in
          {' '}
          <a href="https://github.com/handsontable/spreadsheet-viewer/wiki/JavaScript-API" target="_blank" rel="noopener noreferrer">
            JavaScript API
          </a>
        </li>
      </ul>
    </div>
  );
};
