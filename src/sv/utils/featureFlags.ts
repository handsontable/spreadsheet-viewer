import { parseURLParams } from './QueryStringService';

export const FEATURE_CHARTS = 'charts';
export const FEATURE_FULL_PAGE = 'fullPage';
export const FEATURE_MORE_FORMATS = 'moreformats';

const QUERY_PARAM = 'flags';
const FEATURE_FLAGS_DEFAULT = Object.freeze({});

export type FeatureFlag =
  | typeof FEATURE_CHARTS
  | typeof FEATURE_FULL_PAGE
  | typeof FEATURE_MORE_FORMATS;

type FlagsMap = {[flag in FeatureFlag]?:boolean};

let current: FlagsMap|null = null;

const create = (): FlagsMap => {
  if (window.location.hash.length === 0) {
    return FEATURE_FLAGS_DEFAULT;
  }

  return parseURLParams(window.location.hash)
    .get(QUERY_PARAM)
    ?.split(',')
    .reduce((p, c) => { p[c as FeatureFlag] = true; return p; }, { ...FEATURE_FLAGS_DEFAULT } as FlagsMap)
  ?? FEATURE_FLAGS_DEFAULT;
};

const resolve = (flag: FeatureFlag): boolean => {
  if (current === null) {
    current = create();
  }

  return current[flag] ?? false;
};

export const isChartsEnabled = () => resolve(FEATURE_CHARTS);
export const isFullPageEnabled = () => resolve(FEATURE_FULL_PAGE);
export const isMoreFormatsEnabled = () => resolve(FEATURE_MORE_FORMATS);
