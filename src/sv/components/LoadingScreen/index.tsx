import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="sv-loading-screen">
      <div className="sv-loading-screen--spinner" />
      <div className="sv-loading-screen--details">
        <p>Loading...</p>
      </div>
    </div>
  );
};
