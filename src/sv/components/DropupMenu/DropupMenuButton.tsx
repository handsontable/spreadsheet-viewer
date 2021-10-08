import React from 'react';
import { HamburgerIcon } from '../icons/HamburgerIcon';
import { HamburgerIconMobile } from '../icons/HamburgerIconMobile';

export type DropupMenuButtonProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  isClicked: boolean;
  isMobile: boolean;
};

export const DropupMenuButton: React.FC<DropupMenuButtonProps> = (props) => {
  const { onClick, isClicked, isMobile } = props;

  return (
    // TODO add key event handling for accessibility
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className="sv-dropup-menu-button"
      role="button"
      tabIndex={0}
      onClick={onClick}
      data-cy="dropup-menu-button"
    >
      {isMobile
        ? (
          <HamburgerIconMobile isActive={isClicked} />
        )
        : (
          <HamburgerIcon isActive={isClicked} />
        )}
    </div>
  );
};
