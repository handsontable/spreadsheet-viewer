import React from 'react';
import { PrintIcon } from '../icons/toolbar/PrintIcon';

// TODO: implement print feature, see https://github.com/handsontable/spreadsheet-viewer-dev/pull/457#discussion_r436961804
export const Print = () => {
  return (
    <button type="button" className="icon">
      <PrintIcon />
      <div role="tooltip" className="icon-tooltip">
        <span>Print</span>
      </div>
    </button>
  );
};
