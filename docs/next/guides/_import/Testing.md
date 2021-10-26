## Test files

The folder https://github.com/handsontable/spreadsheet-viewer-dev/tree/develop/cypress/fixtures contains sample workbook (XLSX, XLS) files that are used in automated and manual testing.

## Test configurations

The project repository uses five configurations to assure code quality:

1. Code linting
2. Unit testing
3. Cross-browser visual testing using TestingBot
4. Detailed visual testing with PNG snapshots using Cypress in a Docker container
5. Detailed visual testing debugger (without PNG snapshots) using Cypress in Electron GUI

Points 1-4 are run automatically in our continuous integration setup on GitHub Actions. Point 5 is only meant to be run manually.

### Code linting

We use code linting implemented via ESLint. Code style is verified as part of the test chain. To run the linter manually, use:

```
yarn lint
```

It is possible to automatically fix many problems by running:

```
yarn lint:fix
```

### Unit testing

There are some unit tests use the Mocha framework. Building is not required to run the unit tests. Simply use:

```
yarn test:unit
```

### Detailed visual testing with PNG snapshots using Cypress in a Docker container

Headless testing with PNG snapshots requires using a Docker container, because this is the only way to achieve the same rendering on different OS.

`webpack-dev-server` (used by `yarn start`) doesn't support being ran in Cypress, we need to therefore use a separate build and server. To keep the tests quick, it's ideal to build a `modern` bundle for production with `MINIMIZE` set to `false`, and serve it with `yarn serve:sv`. Cypress can only run Chrome and Firefox, so the `legacy` build would not be used here anyway. This building procedure can be wrapped up as a one-liner:

```bash
BUNDLE=modern MINIMIZE=false yarn build && yarn serve:sv # This should take ~8 seconds
```

Now you can run all specs in another terminal window:

```
yarn test:snapshot           # For Mac & Windows
yarn test:snapshot:linux     # For Linux
```

A full test run takes about 20 minutes on a local machine. In CI, that time is shortened to less then 10 minutes, because the specs run in parallel.

The special script for Linux (`test:snapshot:linux`) is a workaround for `https://github.com/docker/for-linux/issues/264`.

Whenever the test run detects a regression, the diff PNG is saved under `cypress/snapshots/snapshots/<filename>.spec.js/__diff_output__/`. If you confirm that the regression is desired, you should overwrite the source PNGs by deleting the `cypress/snapshots` folder and running the tests again. The content of `__diff_output__` should **never** be committed to Git.

Run a specific test:

```
# Bash
CYPRESS_cmd='--spec cypress/integration/workbooks/formatting.spec.js' yarn test:snapshot        # For Mac & Windows
CYPRESS_cmd='--spec cypress/integration/workbooks/formatting.spec.js' yarn test:snapshot:linux  # For Linux
```

More options: https://docs.cypress.io/guides/guides/command-line.html

### Detailed visual testing debugger (without PNG snapshots) using Cypress in Electron GUI

Before running the test runner GUI for the first time, you will need to install the Cypress app locally:

```
./node_modules/.bin/cypress install
```

Them, launch Cypress GUI using the command:

```
yarn test:gui
```

The Cypress window will open, in which you need to select "Chrome" from the browser selection menu and click "Run all specs".

### Cross-browser visual testing using TestingBot

We use [TestingBot](https://testingbot.com) to smoke test on a few browsers other than Chrome (look at `testing-bot/index.ts` for the up to date list of browsers being tested).

The tests use a local server but run in the TestingBot cloud, it's possible to use both `webpack-dev-server` and `yarn serve:sv` to run the tests:

```bash
MINIMIZE=false yarn build && yarn serve:sv # (omit BUNDLE=modern because we will also run IE11 tests)
# ...or simply
yarn start
```

After starting the development server, run the `testing-bot` script which will interactively guide you further in the installation process.

```bash
yarn testing-bot
```

It's possible to either compare to currently saved snapshot, or regenerate new ones:

```bash
# Regenerate all snapshots
yarn testing-bot --scenario=all --execution-mode=regenerate
# ...or with an alias for the above command
yarn testing-bot:regenerate

# Compare all snapshots
yarn testing-bot --scenario=all --execution-mode=compare

# Only a single snapshot
yarn testing-bot --scenario=win10-ie11
```

Note that the above commands are usually not needed when running them from your terminal, as `yarn testing-bot` provides an interactive CLI for selecting these options.

To obtain the keys, login to https://testingbot.com and visit https://testingbot.com/members/user/edit.