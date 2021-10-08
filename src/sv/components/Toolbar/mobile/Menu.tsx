import React from 'react';
import { KebabMenuIcon } from '../../icons/toolbar/mobile/KebabMenuIcon';
import { StyledDropdownMenu } from './StyledDropdownMenu';

export const MobileMenu: React.FC = ({ children }) => {
  const [anchorEl, setAnchorEl] = React.useState<undefined | SVGSVGElement>(undefined);

  const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  return (
    <button type="button" className="icon icon-mobile" data-cy="mobile-menu-icon">
      <KebabMenuIcon onClick={handleClick} />
      <StyledDropdownMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {children}
      </StyledDropdownMenu>
    </button>
  );
};
