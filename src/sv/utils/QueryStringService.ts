import { Either, Right, Left } from 'purify-ts/Either';

import {
  Codec, string, optional, GetInterface, boolean
} from 'purify-ts/Codec';
import { ThemeStylesheet } from '../entities/MessagesShared';

// simpler version of native URLSearchParams API that is not supported in IE11
// given a string like ?workbookUrl=file.xlsx&sheet=1&themeStylesheet=light
// returns an object {workbookUrl: 'file.xlsx', sheet: '1', themeStylesheet: 'light'}
export function parseURLSearchParams(queryString: string) {
  const result = new Map<string, string>();
  const withoutQuestionMark = queryString.substr(1);
  const pairs = withoutQuestionMark.split('&');
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
  const positionOfQuestionMark = windowUrl.indexOf('?');
  if (positionOfQuestionMark === -1) {
    return {
      error: undefined,
      queryParameters: emptyParams,
    };
  }

  const urlFragment = windowUrl.substr(positionOfQuestionMark);
  const params = parseURLSearchParams(urlFragment);

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
