import React from 'react';
import Menu from '@material-ui/core/Menu';

type StyledDropdownMenu = {
  anchorEl: undefined | SVGSVGElement;
  keepMounted: boolean;
  open: boolean;
  onClose: () => void;
};

export const StyledDropdownMenu: React.FC<StyledDropdownMenu> = (props) => {
  const { children } = props;

  return (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      PaperProps={{
        style: {
          maxHeight: 192,
          width: 200,
        }
      }}
      classes={{ paper: 'toolbar-mobile-menu-wrapper', list: 'toolbar-mobile-menu-list' }}
      {...props}
    >
      {children}
    </Menu>
  );
};
