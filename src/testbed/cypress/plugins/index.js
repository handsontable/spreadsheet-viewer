// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--window-size=1920,1080');
      return launchOptions;
    }
    if (browser.name === 'electron') {
      // fix https://github.com/cypress-io/cypress/issues/2102#issuecomment-478062743
      launchOptions.args.width = 1920;
      launchOptions.args.height = 1080;

      return launchOptions;
    }
  });
};
