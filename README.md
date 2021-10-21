# About this repository

This repository contains the source code for Spreadsheet Viewer assets.

Public Spreadsheet Viewer documentation is available in the [Public SV Wiki](https://github.com/handsontable/spreadsheet-viewer/wiki). Developer documentation is available in the [Developer SV Wiki](https://github.com/handsontable/spreadsheet-viewer-dev/wiki).

For sample usage of Spreadsheet Viewer, see the [spreadsheet-viewer-samples](https://github.com/handsontable/spreadsheet-viewer-samples) repository.


# How to run the project

## Prerequisites

Call `yarn` each time when you pull from the repo. The first time it might take up to 5 minutes, because Yarn downloads the Docker images, clones the Git submodules, etc.

This command runs a `prepare` script defined in `package.json` that updates submodules and installs their dependencies.

To only update submodules without installing from npm, run `yarn prepare:submodules`.

## Building

There are three main commands used for building the bundles:

- `yarn start` - start a development server (`webpack-dev-server`) for the `sv` project on port `5000` (customizable with `--port`, e.g. `yarn start --port 8080`), rebuilding the bundle on any file changes. Then open [http:/localhost:5000](http:/localhost:5000) (it might take 1 minute the first time). This is most desired for usual development, see examples below.

- `yarn build` - build (by default in production) both the `client-library` and `sv` projects, and place the results into `dist/`. There is no server that runs for that, see the next command.

- `yarn serve:sv` - start a simple HTTP static server on port `5000` pointing to `dist/sv`, mimicking how Spreadsheet Viewer might be deployed on a production environment. This is only useful with combination with `yarn build`.

---

The development experience, as in both `yarn start` and `yarn build` can be customized in the following ways (UPPERCASE variables represent environment variables):

- `mode` - `NODE_ENV=development` for `development`, otherwise always `production`. This sets's [Webpack's `config.mode`](https://webpack.js.org/configuration/mode). `development` build includes necessities necessary for development, like source maps and react's development build.
- `minimize` - `MINIMIZE=false` or `MINIMIZE=true` (defaults to `true` in `mode` = `production`, otherwise `false`). The minimization step is the longest of all steps in the build and toggling it off makes the build way quicker.
- `bundle` - `BUNDLE=modern` / `BUNDLE=legacy` / `unspecified` (both bundles) - defaults to both bundles. Determines which bundle to build, `legacy` bundle runs on anything that doesn't support [esmodules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), `modern` runs on any browser that does support them.

These customizations can be used interchangeably, depending on the developer's needs. Presented below are a couple of examples that will be especially useful:

### Normal development

For normal development we can simply start `webpack-dev-server` with only the `modern` bundle, assuming you're developing on a modern browser:

```bash
BUNDLE=modern yarn start
```

### Development on IE11

If you need exclusively IE11, simply set `BUNDLE` to `legacy` and start the dev server:
```bash
BUNDLE=legacy yarn start
```
You can also build both bundles to serve the legacy and modern browsers simultaneously:
```bash
yarn start
```

### Building to production

This command will build both the `client-library` and `sv` in production mode, with both bundles, with everything minimized:
```bash
rm -rf dist && yarn build
```

# Development

## Git submodules: Handsontable

This repo contains one dependency (Handsontable) as a Git submodule.

Working with dependencies using a submodule gives several advantages. We can:

- try changes directly in the dependency code if needed
- use a branch of the dependency without waiting for a versioned release
- we don't have to rely on the dependency builds at all, because we include the dependency into the SpreadsheetViewer build chain
- tools like `nodemon` observe changes made in `submodule/*` and rebuild SpreadsheetViewer on any such change
- tree-shake the dependency to contain only the features that are needed in SpreadsheetViewer, to the extent allowed by the architecture of the dependency

A quick recap on how to use submodules:

- read: `yarn prepare:submodules` automatically retrieves the content of the submodule repos
- write: you can update the content of the submodule in such way:

```
cd submodules/handsontable
git checkout 6f551e1 # check out the desired Handsontable commit. If needed, you can commit and push to Handsontable repo
cd ../.. # return to the parent (SpreadsheetViewer) repo
git add submodules
git commit -m "bump Handsontable a version 6f551e1 that includes ..."
```

# Testing

This repo uses three configurations of the testing framework:

1. Unit testing
2. Visual testing with PNG snapshots using Cypress in a Docker container
3. Visual testing debugger (without PNG snapshots) using Cypress in Electron GUI
4. Cross-browser visual testing using TestingBot

## Unit testing

There are some unit tests use the Mocha framework. Building is not required to run the unit tests. Simply use:

```
yarn test:unit
```

## Visual testing with PNG snapshots using Cypress in a Docker container

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

## Visual testing debugger (without PNG snapshots) using Cypress in Electron GUI

Before running the test runner GUI for the first time, you will need to install the Cypress app locally:

```
./node_modules/.bin/cypress install
```

Them, launch Cypress GUI using the command:

```
yarn test:gui
```

The Cypress window will open, in which you need to select "Chrome" from the browser selection menu and click "Run all specs".

## Cross-browser visual testing using TestingBot

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

# Performance measurement

This repo contains a custom performance measurement tool that is used in the CI workflow and can also be used manually. 

To run it, execute the following code:

```bash
NODE_ENV=staging yarn build:sv && yarn serve:sv
# Then in another terminal window
yarn perf
```

It is explained on the page https://github.com/handsontable/spreadsheet-viewer-dev/wiki/Performance.
