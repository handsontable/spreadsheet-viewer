import React from 'react';

export const LogoIcon = () => {
  return (
    <svg viewBox="0 0 18 18">
      <defs>
        <linearGradient id="sv_svg__b" x1="1" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#0443c1" />
          <stop offset="1" stopColor="#c2c8f0" />
        </linearGradient>
        <clipPath id="sv_svg__a">
          {' '}
          <path d="M2 0h14a2 2 0 012 2v14a2 2 0 01-2 2H2a2 2 0 01-2-2V2a2 2 0 012-2z" fill="#0f9d58" />
        </clipPath>
      </defs>
      <g clipPath="url(#sv_svg__a)">
        <path transform="rotate(90 9 9)" fill="url(#sv_svg__b)" d="M0 0h18v18H0z" />
        <path d="M0 0l9-9 6 6-9 9z" fill="#c2c8f0" />
        <path d="M-9 9l9-9 6 6-9 9z" fill="#98a5e6" />
        <path d="M6 6l9-9 6 6-9 9z" fill="#6c82dc" />
        <path d="M-3 15l9-9 6 6-9 9z" fill="#4767d4" />
        <path d="M12 12l9-9 6 6-9 9z" fill="#104acc" />
        <path d="M3 21l9-9 6 6-9 9z" fill="#0443c1" />
      </g>
    </svg>
  );
};
