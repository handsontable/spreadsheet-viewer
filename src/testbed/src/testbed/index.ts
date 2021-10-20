import './utils/polyfills';
import { displayImageData } from './utils/imageOverlay';
import {
  StoredFileType, putFileInBrowserStorage, getFileFromBrowserStorage, deleteFileFromBrowserStorage, updateActiveSheetInTheCurrentWorkbook
} from './browserStorage';
import { installKeyboardCellsSelection } from './utils/selectCells';
import { installToggleSidebar } from './utils/sidebarFiles';
import { getThemeStylesheet, installToggleTheme } from './utils/changeTheme';
import { getFeatureFlagsRaw } from './utils/featureFlags';

import {
  ACTIVE_SHEET_CHANGED,
  CELL_SELECTION_CHANGED,
  initTimeout,
  SpreadsheetViewer,
  SpreadsheetViewerError,
  VIEW_ACTIVATED
} from '~/../../dist/client-library/clientLibrary';

const dropzoneElement = document.querySelector('.dropzone');
const svContainer = document.querySelector('#spreadsheet-viewer') as HTMLDivElement;
const fileInputElement = document.getElementById('fileInput') as HTMLInputElement;
const CLASS_RENDERER_SHOW = 'show';
const CLASS_FILE_OVER = 'ok';

let flags = getFeatureFlagsRaw();
flags = flags ? `?flags=${flags}` : '';

const assetsUrl = `/sv-assets/index.html${flags}`;
const sv = SpreadsheetViewer({ container: svContainer, assetsUrl });

let attemptLoadFromBrowserStorage = false; // TODO remove using browser storage completely from the demo

const showRenderer = () => {
  dropzoneElement.classList.add(CLASS_RENDERER_SHOW);
};

const openWorkbookData = async(workbookUrl: string | ArrayBuffer, sheet: number, fileName: string) => {
  try {
    const instance = await sv; // this "await sv" always runs as the second (only when a file was picked)
    instance.loadWorkbook(workbookUrl, sheet, fileName);
    showRenderer();
  } catch (e) {
    if (e instanceof SpreadsheetViewerError) {
      console.error(`SpreadsheetViewer failed to initialize within ${initTimeout / 1000} seconds.`, e);
    } else {
      throw e; // rethrow an unexpected error
    }
  }
};

const addHighlight = () => dropzoneElement.classList.add(CLASS_FILE_OVER);
const removeHighlight = () => dropzoneElement.classList.remove(CLASS_FILE_OVER);

const onDragOver = (e: DragEvent) => {
  if (e.defaultPrevented) {
    return;
  }
  e.preventDefault(); // Prevent the default behavior (Prevent file from being opened)
  addHighlight();
};
const onDragLeave = () => { removeHighlight(); };

const getFileAsArrayBuffer = (file: File) => new Promise<ArrayBuffer>((resolve, reject) => {
  if (file.name) {
    console.log(`RECEIVED FILE: ${file.name}`);
  }
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.addEventListener('load', (e) => {
    if (e.target?.result && e.target.result instanceof ArrayBuffer) {
      resolve(e.target.result);
    } else {
      reject();
    }
  });
});

const clearImageData = () => {
  deleteFileFromBrowserStorage(StoredFileType.Image);
  displayImageData(null);
};

/**
 * @param url can be a Data URL or a traditional HTTP(S) URL
 * @param fileName
 */
export const storeAndRenderWorkbook = async(workbookLocation: string | ArrayBuffer, fileName: string) => {
  const lastDot = fileName.lastIndexOf('.');
  const ext = lastDot > -1 ? fileName.substring(lastDot + 1).toLowerCase() : '';

  if (['jpg', 'jpeg', 'png', 'gif'].indexOf(ext) > -1) {
    const url = (() => {
      if (typeof workbookLocation === 'string') {
        if (workbookLocation.indexOf('data:') === 0) {
          return URL.createObjectURL(workbookLocation);
        }

        return workbookLocation;
      }

      return URL.createObjectURL(new Blob([workbookLocation]));
    })();

    displayImageData(url, () => {
      clearImageData();
      URL.revokeObjectURL(url);
    });
    await putFileInBrowserStorage(StoredFileType.Image, fileName, workbookLocation);
  } else {
    clearImageData();
    await putFileInBrowserStorage(StoredFileType.Workbook, fileName, workbookLocation, openWorkbookData); // might reset sheet index that is sent to openWorkbookData
  }
};

const processFiles = async(files: FileList) => {
  attemptLoadFromBrowserStorage = false;

  if (files.length === 0) {
    return;
  }
  const file = files.item(0); // if multiple files are provided, we only process the first file
  const fileAsArrayBuffer = await getFileAsArrayBuffer(file);
  await storeAndRenderWorkbook(fileAsArrayBuffer, file.name);
};

const onDrop = (e: DragEvent & CustomEvent) => {
  if (e.defaultPrevented) {
    return;
  }
  e.preventDefault(); // Prevent the default behavior (Prevent file from being opened)
  removeHighlight();

  const files = e.dataTransfer?.files || e.detail?.files || false;
  if (files) {
    processFiles(files);
  }
};

const onFilePicked = (e: Event) => {
  const picker = e.target as HTMLInputElement;

  if (picker?.files) {
    processFiles(picker.files);
  }
};

const onDropzoneClick = () => fileInputElement.click();

dropzoneElement.addEventListener('click', onDropzoneClick);
fileInputElement.addEventListener('change', onFilePicked);
dropzoneElement.addEventListener('drop', onDrop);
dropzoneElement.addEventListener('dragover', onDragOver);
dropzoneElement.addEventListener('dragleave', onDragLeave);

const init = async() => {
  try {
    const instance = await sv; // this "await sv" always runs as the second (only when a file was picked)
    dropzoneElement.addEventListener(ACTIVE_SHEET_CHANGED, (e: CustomEvent) => {
      const { sheet } = e.detail;
      console.log('Active sheet changed', sheet);
      updateActiveSheetInTheCurrentWorkbook(sheet);
    });
    dropzoneElement.addEventListener(CELL_SELECTION_CHANGED, (e: CustomEvent) => {
      console.log('Cells range data', e.detail.range);
    });
    dropzoneElement.addEventListener(VIEW_ACTIVATED, (e: CustomEvent) => {
      console.log('View activated - screen:', e.detail.viewName);
    });
    instance.configure({ licenseKey: 'demo', themeStylesheet: getThemeStylesheet() });

    getFileFromBrowserStorage(StoredFileType.Workbook, (fileAsDataUrl, sheetIndex, fileName) => {
      if (attemptLoadFromBrowserStorage) {
        openWorkbookData(fileAsDataUrl, sheetIndex, fileName);
      }
    });
    getFileFromBrowserStorage(StoredFileType.Image, fileAsDataUrl => displayImageData(fileAsDataUrl, clearImageData));

    installKeyboardCellsSelection(window, instance);
    installToggleSidebar(window);
    installToggleTheme(window, instance);
  } catch (e) {
    if (e instanceof SpreadsheetViewerError) {
      console.error(`SpreadsheetViewer failed to initialize within ${initTimeout / 1000} seconds.`, e);
    } else {
      throw e; // rethrow an unexpected error
    }
  }
};

init();
