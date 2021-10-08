import React from 'react';
import { DropboxIcon } from '../icons/toolbar/DropboxIcon';

// TODO: implement dropbox upload, see https://github.com/handsontable/spreadsheet-viewer-dev/pull/457#discussion_r436972328
export const Dropbox = () => {
  return (
    <button type="button" className="icon">
      <DropboxIcon />
      <div role="tooltip" className="icon-tooltip">
        <span>Add to</span>
      </div>
    </button>
  );
};
