/**
 * Counter created mainly for testing purposes, but can be uses for client to get info if SV is fully loaded.
 * @see https://github.com/handsontable/spreadsheet-viewer-dev/issues/689
 */

let counter = 0;

export const increaseLazyEmbedsCounter = () => {
  counter += 1;
  if (counter === 1) {
    delete document.body.dataset.embedsLoaded; // removes data-embeds-loaded attribute from <body>
  }
};

export const decreaseLazyEmbedsCounter = () => {
  counter = Math.max(counter - 1, 0);
  if (counter === 0) {
    setTimeout(() => { document.body.dataset.embedsLoaded = ''; }, 0); // sets data-embeds-loaded attribute on <body>. Currently, the only purpose of this class name is to pause Cypress tests until floating boxes are loaded
  }
};

/**
 * This introduce additional control for files without lazy loaded floating boxes.
 * Using of `initializeLazyEmbedsCounter` forces the need to call `resolveEmbedsLoadedFlag`
 * For more details @see `resolveEmbedsLoadedFlag` doc.
 */
export const initializeLazyEmbedsCounter = () => {
  counter = 0;
  increaseLazyEmbedsCounter(); // needed for being sure that the flag doesn't appear to quick
};

/**
 * The flag is added in one of two situation:
 *  * Lazy embeds don't exist: flag is added immediately after `resolveEmbedsLoadedFlag` is called (HOT is rendered)
 *  * Lazy embeds exist: the flag is added after decreasing same times like increase was done, but do not earlier than `resolveEmbedsLoadedFlag`
 * Works properly only with `initializeLazyEmbedsCounter` called earlier
 * @note The flag is resolved automatically when `initializeLazyEmbedsCounter` and `resolveEmbedsLoadedFlag` was never called, but it works only for files with floating boxes
 */
export const resolveEmbedsLoadedFlag = () => {
  decreaseLazyEmbedsCounter();
};
