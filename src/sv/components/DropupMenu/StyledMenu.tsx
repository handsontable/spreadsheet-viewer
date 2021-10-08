import React from 'react';
import Menu from '@material-ui/core/Menu';

export type StyledMenuProps = {
  anchorEl: HTMLElement | undefined;
  handleCloseMenu: () => void;
  isMobile: boolean;
};

export const StyledMenu: React.FC<StyledMenuProps> = (props) => {
  const {
    anchorEl, handleCloseMenu, children, isMobile
  } = props;
  const desktopPaperStyle = {
    maxHeight: 267,
    width: 152
  };
  const mobilePaperStyle = {
    maxHeight: 232,
    width: 232
  };

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      // styles applied to Paper component to make is max height menu. See https://material-ui.com/components/menus/#max-height-menus
      PaperProps={{
        style: isMobile ? mobilePaperStyle : desktopPaperStyle
      }}
      classes={{ paper: 'sv-dropup-menu-container', list: 'sv-dropup-menu-list' }}
    >
      {children}
    </Menu>
  );
};
