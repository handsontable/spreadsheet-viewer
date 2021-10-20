// Press T key to toggle theme between light and dark

import type { SpreadsheetViewerInstance, ThemeStylesheet } from '~/submodules/spreadsheet-viewer-dev/dist/client-library/clientLibrary';
import { parseURLSearchParams } from './url';

const params = parseURLSearchParams(window.location.search);
let isLightThemeEnabled = (params.get('themeStylesheet') === 'light');

const toggleStylesheetLink = (themeStylesheet: ThemeStylesheet) => {
  const lightStylesheet = document.querySelector('head > link[data-theme-name="light"') as HTMLLinkElement;
  const darkStylesheet = document.querySelector('head > link[data-theme-name="dark"]') as HTMLLinkElement;

  if (themeStylesheet === 'dark') {
    darkStylesheet.disabled = false;
    lightStylesheet.disabled = true;
  } else if (themeStylesheet === 'light') {
    darkStylesheet.disabled = true;
    lightStylesheet.disabled = false;
  }
};

export const getThemeStylesheet = () => {
  return isLightThemeEnabled ? 'light' : 'dark';
};

export const installToggleTheme = (hostWindow: Window, svInstance: SpreadsheetViewerInstance) => {
  const toggleThemeOnHotKey = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    const key = event.key || event.keyCode || event.detail.key;

    if (key === 't') {
      isLightThemeEnabled = !isLightThemeEnabled;
      const currentTheme = getThemeStylesheet();
      toggleStylesheetLink(currentTheme);
      svInstance.configure({ themeStylesheet: currentTheme });
    }
  };

  hostWindow.addEventListener('keydown', toggleThemeOnHotKey);
};
