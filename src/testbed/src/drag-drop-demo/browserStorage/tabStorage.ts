const ACTIVE_SHEET_KEY = 'activeSheet';

export const getSheet = (): number => {
  const sheet = sessionStorage.getItem(ACTIVE_SHEET_KEY);
  return sheet === null ? 0 : parseInt(sheet, 10);
};

export const setSheet = (sheet: number) => {
  sessionStorage.setItem(ACTIVE_SHEET_KEY, sheet.toString());
};

export const resetSheet = () => {
  sessionStorage.removeItem(ACTIVE_SHEET_KEY);
};

export const getFileHash = (key: string): string => {
  return sessionStorage.getItem(key);
};

export const setFileHash = (key: string, fileHash: string) => {
  sessionStorage.setItem(key, fileHash);
};

export const resetFileHash = (key: string) => {
  sessionStorage.removeItem(key);
};
