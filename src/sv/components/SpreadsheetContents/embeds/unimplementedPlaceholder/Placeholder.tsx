import React from 'react';
import './Placeholder.less';

export const Placeholder = () => {
  return (
    <div className="sv-chart-image-wrapper">
      <div className="sv-chart-image-placeholder">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#f5f5f5"
            d="M11.094,13.019h7.735c0.057,0,0.105,0.049,0.104,0.106c-0.068,4.946-5.015,
          7.789-9.648,6.554c-2.773-0.739-4.59-2.882-5.139-5.665c-0.433-2.197,0.142-4.497,1.572-6.223c1.379-1.665,
          2.977-2.684,5.142-2.723c0.057-0.001,0.106,0.047,0.106,0.104l0.028,7.748C10.994,12.975,11.039,13.019,
          11.094,13.019z"
          />
          <path
            fill="#f5f5f5"
            d="M13.009,10.878V3.294c0-0.057,0.048-0.105,0.105-0.104C17.163,3.247,21,6.917,21,
          10.978c0,0.002,0,0.004,0,0.006l-7.891-0.006C13.054,10.978,13.009,10.934,13.009,10.878z"
          />
        </svg>
      </div>
    </div>
  );
};