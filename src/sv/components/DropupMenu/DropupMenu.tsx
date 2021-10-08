import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { DropupMenuButton } from './DropupMenuButton';
import { StyledMenu } from './StyledMenu';
import { detectMobileDevice } from '../../utils/detectMobile';

const activeMenuTabClass = 'active';

type DropupMenuProps = {
  currentTabIndex: number
  onTabChange: (t: number) => void
  titles: string[];
};

export const DropupMenu: React.FC<DropupMenuProps> = (props) => {
  const { currentTabIndex, onTabChange, titles } = props;
  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>(undefined);
  const isMobile = detectMobileDevice();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(undefined);
  };

  return (
    <>
      <DropupMenuButton onClick={handleOpenMenu} isClicked={!!anchorEl} isMobile={isMobile} />
      <StyledMenu anchorEl={anchorEl} handleCloseMenu={handleCloseMenu} isMobile={isMobile}>
        {titles.map((title, index) => {
          const activeClass = currentTabIndex === index ? activeMenuTabClass : '';
          return (
            <MenuItem
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              selected={Boolean(activeClass)}
              classes={{ root: 'sv-dropup-menu-item', selected: activeClass }}
              onMouseDown={() => onTabChange(index)}
              disableRipple
              data-cy={`dropup-menu-item-${index}`}
            >
              <div>
                {title}
              </div>
            </MenuItem>
          );
        })}
      </StyledMenu>
    </>
  );
};
