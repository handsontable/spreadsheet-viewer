import React from 'react';

interface KebabMenuIconProps {
  onClick: (event: React.MouseEvent<SVGSVGElement>) => void
}

export const KebabMenuIcon: React.FC<KebabMenuIconProps> = (props) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        // eslint-disable-next-line max-len
        d="M14.25 6.007a2.007 2.007 0 10-2.007 2.007 2.007 2.007 0 002.007-2.007zm0 6.074a2.007 2.007 0 10-2.007 2.007 2.007 2.007 0 002.007-2.007zm0 6.074a2.007 2.007 0 10-2.007 2.007 2.007 2.007 0 002.007-2.007z"
        fill="#fff"
      />
    </svg>
  );
};
