import { indexedDbGetAll } from './shim/indexedDbGetAll';

const DB_NAME = 'drag-drop-sheets';
const DB_VERSION = 2;
const MAXIMUM_FILES_IN_DB = 10;

enum DBStore {
  Files = 'sheets',
  Dates = 'modificationDate'
}

enum DBTransactionMode {
  Read = 'readonly',
  Write = 'readwrite'
}

const getObjectStore = (database: IDBDatabase, storeName: DBStore.Files | DBStore.Dates, mode: DBTransactionMode.Read | DBTransactionMode.Write) => {
  const tx = database.transaction(storeName, mode);
  return tx.objectStore(storeName);
};

const showError = (request: IDBRequest, reject?: Function) => (
  () => {
    if (reject) {
      reject(request.error);
    } else {
      console.error(request.error.message);
    }
  }
);

// Delete the oldest files from DB when they overdraw the stated limit
const deleteOldFilesFromDB = (database: IDBDatabase) => {
  const datesStore = getObjectStore(database, DBStore.Dates, DBTransactionMode.Write);
  const request = indexedDbGetAll(datesStore);
  request.onsuccess = () => {
    const files = request.result;
    if (files.length > MAXIMUM_FILES_IN_DB) {
      const filesStore = getObjectStore(database, DBStore.Files, DBTransactionMode.Write);
      files.sort((a, b) => a.modificationDate - b.modificationDate);
      const oldestFileHash = files[0].hash;
      datesStore.delete(oldestFileHash);
      filesStore.delete(oldestFileHash);
    }
  };
};

export const openDB = () => {
  const request: IDBOpenDBRequest = indexedDB.open(DB_NAME, DB_VERSION);
  return new Promise<IDBDatabase>((resolve, reject) => {
    request.onsuccess = () => {
      const database: IDBDatabase = request.result;
      deleteOldFilesFromDB(database);
      resolve(database);
    };
    request.onerror = showError(request, reject);
    request.onupgradeneeded = (event) => {
      const database: IDBDatabase = request.result;
      if (event.oldVersion < 2) {
        const storeNames = Array.prototype.slice.call(database.objectStoreNames, 0); // equivalent to Array.from but works in IE11
        // in version 1, the structure of stores was different, clean it up now
        if (storeNames.indexOf(DBStore.Files) > -1) {
          database.deleteObjectStore(DBStore.Files);
        }
        if (storeNames.indexOf(DBStore.Dates) > -1) {
          database.deleteObjectStore(DBStore.Dates);
        }
        database.createObjectStore(DBStore.Files, { keyPath: 'hash' });
        database.createObjectStore(DBStore.Dates, { keyPath: 'hash' });
      }
    };
  });
};

const addFileDatesToDB = async(database: IDBDatabase, hash: string, fileName: string, modificationDate: Date) => {
  const datesStore = getObjectStore(database, DBStore.Dates, DBTransactionMode.Write);
  const request = datesStore.add({
    hash,
    fileName,
    modificationDate
  });
  request.onerror = showError(request);
  return null;
};

export const hasFileHashInDB = (database: IDBDatabase, hash: string) => {
  return new Promise((resolve, reject) => {
    const filesStore = getObjectStore(database, DBStore.Files, DBTransactionMode.Read);
    const request = filesStore.get(hash);
    request.onsuccess = function() {
      resolve(!!request.result);
    };
    request.onerror = showError(request);
  });
};

export const addFileContentsToDB = async(database: IDBDatabase, hash: string, fileName: string, modificationDate: Date, fileContents: ArrayBuffer) => {
  const filesStore = getObjectStore(database, DBStore.Files, DBTransactionMode.Write);
  const request = filesStore.add(
    {
      hash,
      fileName,
      fileContents,
    }
  );
  request.onsuccess = await addFileDatesToDB(database, hash, fileName, modificationDate);
  request.onerror = showError(request);
  deleteOldFilesFromDB(database);
};

export const updateFileDateInDB = (database: IDBDatabase, hash: string, fileName: string, modificationDate: Date) => {
  const datesStore = getObjectStore(database, DBStore.Dates, DBTransactionMode.Write);
  datesStore.put({ hash, fileName, modificationDate });
};

export const getFileFromDB = (database: IDBDatabase, savedHash: string): Promise<{ fileContents: ArrayBuffer, fileName: string }> => {
  return new Promise((resolve, reject) => {
    const filesStore = getObjectStore(database, DBStore.Files, DBTransactionMode.Read);
    const request = filesStore.get(savedHash);
    request.onsuccess = () => {
      if (!request.result) return;
      const { hash, fileName, fileContents } = request.result;
      resolve({ fileContents, fileName });
      updateFileDateInDB(database, hash, fileName, new Date());
    };
    request.onerror = showError(request, reject);
  });
};
