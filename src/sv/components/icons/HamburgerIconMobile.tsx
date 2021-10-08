import React from 'react';

type HamburgerIconMobileProps = {
  isActive: boolean;
};

export const HamburgerIconMobile: React.FC<HamburgerIconMobileProps> = (props) => {
  const { isActive } = props;

  return (
    <>
      <svg height="24" width="24" viewBox="0 0 24 24" className={isActive ? 'active' : 'inactive'}>
        {/* <path fill="none" d="M0 0h24v24H0z" /> */}
        <g transform="translate(-679.64 -429.029)">
          <rect
            className="sv-hamburger-icon"
            width={20.001}
            height={2}
            rx={0.098}
            transform="translate(681.64 433.029)"
          />
          <rect
            className="sv-hamburger-icon"
            width={20.001}
            height={2}
            rx={0.098}
            transform="translate(681.64 440.029)"
          />
          <rect
            className="sv-hamburger-icon"
            width={20.001}
            height={2}
            rx={0.098}
            transform="translate(681.64 447.029)"
          />
        </g>
      </svg>
    </>
  );
};
