import { parseURLSearchParams } from './url';

export const getFeatureFlagsRaw = ():string => {
  return parseURLSearchParams(window.location.search).get('flags') || '';
};
