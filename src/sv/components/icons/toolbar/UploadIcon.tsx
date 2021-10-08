import React from 'react';

export const UploadIcon = () => {
  return (
    <svg viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0z" />
      <rect
        className="svg-icon"
        width={14}
        height={2}
        rx={0.095}
        transform="translate(5 3)"
      />
      <path
        className="svg-icon"
        // eslint-disable-next-line max-len
        d="M8.116 12h2.789a.1.1 0 01.095.1v8.809a.1.1 0 00.095.1h1.81a.1.1 0 00.095-.1V12.1a.1.1 0 01.095-.1h2.789a.1.1 0 00.067-.163l-3.884-3.874a.1.1 0 00-.134 0l-3.884 3.874a.1.1 0 00.067.163z"
      />
    </svg>
  );
};
