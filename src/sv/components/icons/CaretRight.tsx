import * as React from 'react';

export const CaretRight = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" preserveAspectRatio="none" {...props}>
      <path
        d="M5 4.082v7.92a.082.082 0 00.126.07l6.335-3.96a.082.082 0 000-.14L5.126 4.011A.083.083 0 005 4.082z"
      />
    </svg>
  );
};
