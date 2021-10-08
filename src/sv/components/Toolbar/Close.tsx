import React from 'react';
import { CloseIcon } from '../icons/toolbar/CloseIcon';

export const Close = () => {
  return (
    <button type="button" className="icon" id="close-icon">
      <CloseIcon />
      <div role="tooltip" className="icon-tooltip">
        <span>Close</span>
      </div>
    </button>
  );
};
