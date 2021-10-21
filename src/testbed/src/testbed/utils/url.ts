// simpler version of native URLSearchParams API that is not supported in IE11
// given a string like ?workbookUrl=file.xlsx&sheet=1&themeStylesheet=light
// returns an object {workbookUrl: 'file.xlsx', sheet: '1', themeStylesheet: 'light'}
export const parseURLSearchParams = (queryString: string) => {
  const result = new Map<string, string>();
  if (!queryString) {
    return result;
  }
  const withoutQuestionMark = queryString.substr(1);
  const pairs = withoutQuestionMark.split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    result.set(decodeURIComponent(pair[0]), decodeURIComponent(pair[1] || ''));
  }
  return result;
};
