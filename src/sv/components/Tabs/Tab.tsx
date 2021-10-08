import React from 'react';
import Tab from '@material-ui/core/Tab';

export const createTab = (title: string, index: number, clicked: () => void) => (
  <Tab
    label={title}
    key={index}
    className="sv-tab"
    data-cy="tabbar-workbook-tab"
    disableRipple
    onMouseDown={(e) => {
      e.preventDefault();
      clicked();
    }}
  />
);
