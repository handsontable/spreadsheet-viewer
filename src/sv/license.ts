export const isValidLicenseKey = (key: unknown) => typeof key === 'string' && key.length > 0;
