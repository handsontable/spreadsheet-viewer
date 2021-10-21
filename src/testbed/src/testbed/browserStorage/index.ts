import {
  hasFileHashInDB, updateFileDateInDB, addFileContentsToDB, getFileFromDB, openDB
} from './permanentStorage';
import {
  setFileHash, getFileHash, resetSheet, getSheet, resetFileHash, setSheet
} from './tabStorage';
import { hashString, hashArrayBuffer } from './hash';

export enum StoredFileType {
  Image,
  Workbook
}

const INVALID_STATE_ERROR = 'InvalidStateError';
const WORKBOOK_DATA_KEY = 'fileDataURL';
const IMAGE_DATA_KEY = 'imageDataURL';
const dbPromise = openDB();

const handleOpenDbError = (error) => {
  if (error.name === INVALID_STATE_ERROR) {
    // Regards to the MDN docs - https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
    console.error('You can\'t persist data in browser storage when using the Private Browsing in Firefox');
  } else {
    console.error(error.message);
  }
};

// optional "callback" argument is a function that is called after the new sheet index is determined (not after the data is stored)
export const putFileInBrowserStorage = async(fileType: StoredFileType, fileName, workbookLocation: string | ArrayBuffer, callback?) => {
  const fileHash: string = typeof workbookLocation === 'string'
    ? hashString(workbookLocation).toString()
    : hashArrayBuffer(workbookLocation).toString();

  if (fileType === StoredFileType.Image) {
    setFileHash(IMAGE_DATA_KEY, fileHash);
  } else {
    const lastFileHash = getFileHash(WORKBOOK_DATA_KEY);
    resetSheet();
    if (fileHash !== lastFileHash) {
      setFileHash(WORKBOOK_DATA_KEY, fileHash);
    }
  }

  if (callback) {
    callback(workbookLocation, getSheet(), fileName);
  }

  const db = await dbPromise.catch(handleOpenDbError);
  if (db) {
    const isFileHashExists = await hasFileHashInDB(db, fileHash);
    const modificationDate = new Date();
    if (isFileHashExists) {
      await updateFileDateInDB(db, fileHash, fileName, modificationDate);
    } else {
      await addFileContentsToDB(db, fileHash, fileName, modificationDate, workbookLocation);
    }
  }
};

export const getFileFromBrowserStorage = async(fileType: StoredFileType, callback) => {
  const db = await dbPromise.catch(handleOpenDbError);
  if (!db) {
    return;
  }
  const key = fileType === StoredFileType.Image ? IMAGE_DATA_KEY : WORKBOOK_DATA_KEY;
  const hash = getFileHash(key);
  if (hash) {
    const { fileContents, fileName } = await getFileFromDB(db, hash);
    if (fileContents) {
      const sheetIndex = getSheet();
      setTimeout(() => {
        callback(fileContents, sheetIndex, fileName);
      }, 1000); // TODO remove this timeout, which is a workaround for a race condition in Cypress tests between the file loaded from the storage and the file uploaded
    }
  }
};

export const updateActiveSheetInTheCurrentWorkbook = (sheet: number) => {
  setSheet(sheet);
};

export const deleteFileFromBrowserStorage = (fileType: StoredFileType) => {
  if (fileType === StoredFileType.Image) {
    // we do not delete the file from IndexedDB, because maybe it is used in sessionStorage of another tab
    resetFileHash(IMAGE_DATA_KEY);
  }
};
