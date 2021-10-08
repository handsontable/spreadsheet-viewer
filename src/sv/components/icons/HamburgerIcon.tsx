import React from 'react';

type HamburgerIconProps = {
  isActive: boolean;
};

export const HamburgerIcon: React.FC<HamburgerIconProps> = (props) => {
  const { isActive } = props;

  return (
    <>
      <svg height="16" width="16" viewBox="5 4 16 16" className={isActive ? 'active' : 'inactive'}>
        {/* eslint-disable-next-line max-len */}
        <path className="sv-hamburger-icon" d="M19.922 11H4.078a.09.09 0 00-.078.1v1.8a.089.089 0 00.078.1h15.844a.089.089 0 00.078-.1v-1.8a.09.09 0 00-.078-.1zM19.922 6H4.078A.09.09 0 004 6.1v1.8a.089.089 0 00.078.1h15.844A.089.089 0 0020 7.9V6.1a.09.09 0 00-.078-.1zM19.922 16H4.078a.09.09 0 00-.078.1v1.8a.089.089 0 00.078.1h15.844a.089.089 0 00.078-.1v-1.8a.09.09 0 00-.078-.1z" />
      </svg>
      <div role="tooltip" className="icon-tooltip">
        <span>More sheets</span>
      </div>
    </>
  );
};
