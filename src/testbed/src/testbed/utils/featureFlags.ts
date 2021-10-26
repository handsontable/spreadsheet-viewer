import { parseURLParams } from './url';

export const getFeatureFlagsRaw = ():string => {
  return parseURLParams(window.location.hash).get('flags') || '';
};
