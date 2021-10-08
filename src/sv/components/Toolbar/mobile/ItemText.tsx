import React from 'react';

type ToolbarMobileMenuItemTextProps = {
  description: string;
};

export const ToolbarMobileMenuItemText: React.FC<ToolbarMobileMenuItemTextProps> = ({ description }) => {
  return (
    <p className="toolbar-mobile-menu-item-text">
      {description}
    </p>
  );
};
