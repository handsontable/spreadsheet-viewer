import React from 'react';

interface CloseProps {
  onClose: () => void;
  isMobile: boolean;
}

export const Close: React.FC<CloseProps> = ({ onClose, isMobile }) => {
  const svgDesktopStyles = {
    width: 16,
    height: 16
  };
  const svgMobileStyles = {
    width: 24,
    height: 24
  };

  return (
    <svg
      viewBox="0 0 16 16"
      className="close-icon-modal"
      onClick={onClose}
      data-cy="close-modal"
      {...isMobile ? svgMobileStyles : svgDesktopStyles}
    >
      <path
        // eslint-disable-next-line max-len
        d="M12.054 4.95l-.844-.844a.066.066 0 00-.093 0l-3 3a.066.066 0 01-.093 0l-3-3a.066.066 0 00-.093 0l-.838.844a.066.066 0 000 .093l3 3a.066.066 0 010 .093l-3 3a.066.066 0 000 .093l.844.844a.066.066 0 00.093 0l3-3a.066.066 0 01.093 0l3 3a.066.066 0 00.093 0l.844-.844a.066.066 0 000-.093l-3-3a.066.066 0 010-.093l3-3a.066.066 0 00-.006-.093z"
        fill="#1d1d1d"
      />
    </svg>
  );
};
