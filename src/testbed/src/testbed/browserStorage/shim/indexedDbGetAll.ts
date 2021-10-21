// this is a very limited shim of https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAll
// for EdgeHTML. If this shim is inadequate, consider more robust polyfill https://github.com/dumbmatter/IndexedDB-getAll-shim/blob/master/IndexedDB-getAll-shim.js

const isNativeGetAllAvailable = !!IDBObjectStore.prototype.getAll;

const nativeGetAll = (store) => {
  return store.getAll();
};

const shimmedGetAll = (store) => {
  const response = {
    result: [],
    onsuccess: () => {
      throw new Error('onsuccess not implemented in the user code');
    }
  };

  store.openCursor().onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
      response.result.push(cursor.value);
      cursor.continue();
    } else {
      response.onsuccess();
    }
  };

  return response;
};

export const indexedDbGetAll = isNativeGetAllAvailable ? nativeGetAll : shimmedGetAll;
