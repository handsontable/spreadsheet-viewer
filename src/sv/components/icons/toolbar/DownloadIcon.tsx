import React from 'react';

export const DownloadIcon = () => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0z" />
      <rect
        className="svg-icon"
        width={14}
        height={2}
        rx={0.099}
        transform="translate(5 19)"
      />
      <path
        className="svg-icon"
        // eslint-disable-next-line max-len
        d="M8.124 12h2.777a.1.1 0 00.1-.1V3.1a.1.1 0 01.1-.1h1.8a.1.1 0 01.1.1v8.8a.1.1 0 00.1.1h2.778a.1.1 0 01.069.168l-3.876 3.866a.1.1 0 01-.139 0l-3.876-3.866A.1.1 0 018.124 12z"
      />
    </svg>
  );
};
