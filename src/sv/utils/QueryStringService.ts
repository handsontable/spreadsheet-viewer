import { Right, Left } from 'purify-ts/Either';

import {
  Codec, string, optional, GetInterface, boolean
} from 'purify-ts/Codec';
import { ThemeStylesheet } from '../entities/MessagesShared';

// simpler version of native URLSearchParams API that is not supported in IE11
// given a string like #workbookUrl=file.xlsx&sheet=1&themeStylesheet=light
// returns an object {workbookUrl: 'file.xlsx', sheet: '1', themeStylesheet: 'light'}
// compatibility reasons with various HTTP server configurations, we store the parameters
// in the hash part of the URL - that's why they are after the # sign
export function parseURLParams(queryString: string) {
  const result = new Map<string, string>();
  const withoutHash = queryString.substr(1);
  const pairs = withoutHash.split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    result.set(decodeURIComponent(pair[0]), decodeURIComponent(pair[1] || ''));
  }
  return result;
}

const NumberFromString = Codec.custom<number>({
  decode: (x) => {
    const parsed = Number(x);

    if (isNaN(parsed)) {
      return Left('Expected numeric value to not be NaN');
    }

    return Right(parsed);
  },
  encode: x => x
});

const emptyParams: Params = {
  svId: undefined,
  workbookUrl: undefined,
  sheet: undefined,
  fileName: undefined,
  licenseKey: undefined,
  simulateError: undefined,
  themeStylesheet: undefined
};

const Params = Codec.interface({
  svId: optional(string),
  workbookUrl: optional(string),
  sheet: optional(NumberFromString),
  fileName: optional(string),
  licenseKey: optional(string),
  simulateError: optional(string),
  themeStylesheet: optional(ThemeStylesheet)
});
type Params = GetInterface<typeof Params>;

type QueryStringAPIParametersResult = {
  error: string | undefined
  queryParameters: Params
};

export const processQueryStringApiParameters = (windowUrl: string): QueryStringAPIParametersResult => {
  const positionOfHash = windowUrl.indexOf('#');
  if (positionOfHash === -1) {
    return {
      error: undefined,
      queryParameters: emptyParams,
    };
  }

  const urlFragment = windowUrl.substr(positionOfHash);
  const params = parseURLParams(urlFragment);

  const rawParams = {
    svId: params.get('svId'),
    workbookUrl: params.get('workbookUrl'),
    sheet: params.get('sheet'),
    fileName: params.get('fileName'),
    licenseKey: params.get('licenseKey'),
    simulateError: params.get('simulateError'),
    themeStylesheet: params.get('themeStylesheet')
  };

  return Params.decode(rawParams).either<QueryStringAPIParametersResult>(error => ({
    error,
    queryParameters: emptyParams
  }), queryParameters => ({
    error: undefined,
    queryParameters
  }));
};
