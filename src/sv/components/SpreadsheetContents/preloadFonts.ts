import FontFaceObserver from 'fontfaceobserver';
import { getPropertyWithDefault } from '../../utils/has-own-property';

/**
 * Vocabulary:
 * Desired font - font name that comes from the Excel
 * System font - font name of a font family that is installed in the user's system
 * Web font - font name of a font family that is defined in Fonts.less and searched in the user's system or loaded as WOFF files
 * Generic font - font name that is generic in CSS, see https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
 */

// debugging flags
const enableSystemFontToWebFontFallback = true;
/**
 * The below flag enforces ignoring of any system fonts. This will give the most consistent rendering across different systems.
 * By default, system fonts are not ignored. However, this means that Windows will lie to us that it has
 * Helvetica (but in fact give Arial). Ubuntu and Arch Linux will lie to us that they have Arial (but in
 * fact five Liberation Sans).
 * @see https://github.com/handsontable/spreadsheet-viewer-demo/issues/63#issuecomment-557454263
 */
const ignoreSystemFont = false;

const defaultGenericFont = 'sans-serif';
const defaultFallbackFont = 'Arial';
const systemFontsToWebFonts = {
  Arial: 'Liberation Sans',
  'Times New Roman': 'Liberation Serif',
  'Courier New': 'Liberation Mono',
  Calibri: 'Carlito',
  Cambria: 'Caladea',
};
const webFontsToGenericFonts = {
  'Liberation Serif': 'serif',
  'Liberation Mono': 'monospace',
  'Liberation Sans': 'sans-serif',
  Carlito: 'sans-serif',
  Caladea: 'sans-serif'
};
const preloadObservers = new Map();
let numberOfFontsBeingLoaded = 1; // this will be immediately decremented by the call to decreaseLoadingCounter() at the bottom of the module

export function getPreloadQueueSize() {
  return numberOfFontsBeingLoaded;
}

const getGenericFontName = (fontName: string) => getPropertyWithDefault(webFontsToGenericFonts, fontName, defaultGenericFont);

/**
 * Returns a promise that resolves when all pending fonts are loaded or it is determined that they can't be loaded.
 *
 * @returns {Promise}
 */
export function preloadWebFonts(): Promise<any> {
  return Promise.all(Array.from(preloadObservers.values()));
}

/**
 * Returns a promise that resolves when the font is loaded or does not need loading. The promise is rejected if the font can't be loaded.
 *
 * @param webFontName
 * @param fontWeight
 * @param fontStyle
 * @returns {Promise}
 */
function preloadWebFont(webFontName: string, fontWeight: number, fontStyle: string): Promise<any> {
  const observer = new FontFaceObserver(webFontName, {
    weight: fontWeight,
    style: fontStyle
  });

  return observer.load(null, 10000);
}

function getSampleTextWidth(fontFamily: string): number {
  const span = document.createElement('span');
  span.innerHTML = Array(100).join('wi');
  span.style.position = 'absolute';
  span.style.fontSize = '128px';
  span.style.left = '-99999px';
  span.style.fontFamily = fontFamily;

  document.body.appendChild(span);

  const width = span.clientWidth;

  document.body.removeChild(span);

  if (width < 1) {
    throw new Error('Could not measure the text size. Maybe you called too early?');
  }

  return width;
}

let genericSansWidth: number | undefined;
let genericSerifWidth: number | undefined;
const memoizedResults = new Map();

function isSystemFontAvailable(fontName: string): Boolean {
  if (genericSansWidth === undefined) {
    genericSansWidth = getSampleTextWidth('sans-serif');
  }
  if (genericSerifWidth === undefined) {
    genericSerifWidth = getSampleTextWidth('serif');
  }

  if (memoizedResults.has(fontName)) {
    return memoizedResults.get(fontName);
  }

  const widthInSystemFontOrGenericSans = getSampleTextWidth(`${fontName}, sans-serif`);
  const widthInSystemFontOrGenericSerif = getSampleTextWidth(`${fontName}, serif`);
  const result = !(genericSansWidth === widthInSystemFontOrGenericSans && genericSerifWidth === widthInSystemFontOrGenericSerif);

  memoizedResults.set(fontName, result);
  return result;
}

const increaseLoadingCounter = () => {
  numberOfFontsBeingLoaded += 1;
  if (numberOfFontsBeingLoaded === 1) {
    delete document.body.dataset.webfontsLoaded; // removes data-webfonts-loaded attribute from <body>
  }
};

const decreaseLoadingCounter = () => {
  numberOfFontsBeingLoaded -= 1;
  if (numberOfFontsBeingLoaded === 0) {
    document.body.dataset.webfontsLoaded = ''; // sets data-webfonts-loaded attribute on <body>. Currently, the only purpose of this class name is to pause Cypress tests until web fonts are loaded
  }
};

export function extendDesiredFontWithFallbacks(fontName: string, fontWeight: number, fontStyle: string): string {
  const fontChainForCSS = [];
  const webFontName = getPropertyWithDefault(systemFontsToWebFonts, fontName, undefined);

  if (!ignoreSystemFont && isSystemFontAvailable(fontName)) {
    fontChainForCSS.push(`"${fontName}"`);
  } else if (enableSystemFontToWebFontFallback && webFontName) {
    fontChainForCSS.push(`"${webFontName}"`);
    fontChainForCSS.push(`"${getGenericFontName(webFontName)}"`);

    const key = `${webFontName} ${fontWeight} ${fontStyle}`;
    if (!preloadObservers.has(key)) {
      increaseLoadingCounter();
      const promise = preloadWebFont(webFontName, fontWeight, fontStyle).then(() => {
        console.log('Font loaded', webFontName, fontWeight, fontStyle);
        decreaseLoadingCounter();
      }).catch(() => {
        console.log('Font failed to load', webFontName, fontWeight, fontStyle);
        decreaseLoadingCounter();
      });
      preloadObservers.set(key, promise);
    }
  } else {
    fontChainForCSS.push(`"${defaultFallbackFont}"`);
    fontChainForCSS.push(`"${defaultGenericFont}"`);
  }

  return fontChainForCSS.join(', ');
}

decreaseLoadingCounter();
