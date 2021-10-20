const SESSION_STORAGE_KEY = 'sv-demo-image-overlay';
const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
const parsed = stored && JSON.parse(stored);
const isValid = parsed && parsed.x !== undefined && parsed.y !== undefined;
const userSettings = isValid ? parsed : {
  x: 0,
  y: 0
};
let keyboardNavigationInstalled = false;

const resetUserSettings = () => {
  userSettings.x = 0;
  userSettings.y = 0;
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
};

const saveUserSettings = (settings) => {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(settings));
};

const installKeyboardNavigation = (elem, callb) => {
  elem.addEventListener('keydown', (ev: KeyboardEvent) => {
    const distance = ev.shiftKey ? 10 : 1;
    callb(ev.key, distance);
  });
  elem.addEventListener('click', (ev: MouseEvent) => {
    ev.stopPropagation();
  });
  elem.focus();
};

const updateElementPosition = (elem) => {
  const iframeX = 70;
  const iframeY = 47;
  const excelWidowContentX = 35;
  const excelWindowContentY = 234;
  elem.style.left = `${userSettings.x + iframeX - excelWidowContentX}px`;
  elem.style.top = `${userSettings.y + iframeY - excelWindowContentY}px`;
};

let lastExitCallback;
const noop = () => {};

export const displayImageData = (workbookUrl: string, exitCallback?: Function) => {
  lastExitCallback = exitCallback || noop;
  const img = document.querySelector('.image-overlay') as HTMLImageElement;

  if (workbookUrl) {
    console.log(`👨‍💻 Secret unlocked: You added a graphic file that is displayed as an overlay above the spreadsheet.
    Click on the image and use the arrow keys to move it around.`);
    // protip: if you make screenshots in Excel using Alt+PrintScreen, the Excel window will always start at 0,0

    img.setAttribute('src', workbookUrl);
    img.removeAttribute('hidden');
  } else {
    resetUserSettings();
    img.removeAttribute('src');
    img.setAttribute('hidden', '');
  }
  updateElementPosition(img);

  if (!keyboardNavigationInstalled) {
    keyboardNavigationInstalled = true;
    installKeyboardNavigation(img, (key, distance) => {
      if (key === 'ArrowLeft') {
        userSettings.x -= distance;
      } else if (key === 'ArrowRight') {
        userSettings.x += distance;
      } else if (key === 'ArrowUp') {
        userSettings.y -= distance;
      } else if (key === 'ArrowDown') {
        userSettings.y += distance;
      } else if (key === 'Escape') {
        resetUserSettings();
        lastExitCallback();
      }
      saveUserSettings(userSettings);
      updateElementPosition(img);
    });
  }
};
