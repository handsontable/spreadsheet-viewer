import React from 'react';

import lightThemePath from '../styles/light.less';
import darkThemePath from '../styles/dark.less';
import type { ThemeStylesheet } from '../entities/MessagesShared';

type ThemeLoaderProps = {
  themeStylesheet: ThemeStylesheet
};

const themePaths = {
  light: lightThemePath,
  dark: darkThemePath
};

export const ThemeLoader: React.FC<ThemeLoaderProps> = (props) => {
  const { themeStylesheet } = props;

  return (
    <link rel="stylesheet" href={themePaths[themeStylesheet]} />
  );
};
