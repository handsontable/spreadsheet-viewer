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
