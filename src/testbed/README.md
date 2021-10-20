# About this repository

This repository contains sample usage of **[Spreadsheet Viewer](https://github.com/handsontable/spreadsheet-viewer)**. 

It contains:

* Drag and drop demo: [see source](./src/drag-drop-demo)

Spreadsheet Viewer documentation is available in [SV Wiki](https://github.com/handsontable/spreadsheet-viewer/wiki).
  
# How to run the project

## Prerequisites

Call `yarn` each time when you pull from the repo.

The command `yarn` installs the local dependencies and invokes `yarn prepare`, which updates the submodule and its dependencies.

## Developer build

Call `yarn start` and open [http:/localhost:1234](http:/localhost:1234) in your web browser.

This command `yarn start` builds the projects and starts the development server at port `1234`. To run at a different port, provide the port number with the `-p` argument, e.g. `yarn start -p 8080`.

Specifically, this command:
  - builds the demo project located in `src/drag-drop-demo` and watches for file changes.
  - starts a static file server for development.
  - when a change is observed, the relevant project is rebuilt and all clients that have loaded a page from the static file server automatically refresh.


## Production build

Call `yarn build`.


# Development

# Testing

This repo uses two installations of Cypress testing framework:

1. In a Docker container, with PNG snapshots
2. In a local GUI, for debugging of the test runner without PNG snapshots
3. Automated testing with GitHub Actions

## Testing in a Docker container, with PNG snapshots

CLI testing with PNG snapshots requires using a Docker container, because this is the only way to achieve the same rendering on different OS.

Run all specs (the app must already be running):

```
yarn test:snapshot           # For Mac & Windows
yarn test:snapshot:linux     # For Linux
```

The special script for Linux (`test:snapshot:linux`) is a workaround for `https://github.com/docker/for-linux/issues/264`.

Whenever the test run detects a regression, the diff PNG is saved under `cypress/snapshots/snapshots/charts.xls.spec.js/__diff_output__/`. If you confirm that the regression is desired, you should overwrite the source PNGs by deleting the `cypress/snapshots` folder and running the tests again. The content of `__diff_output__` should **never** be committed to Git.

Run a specific test:

```
# Bash
CYPRESS_cmd='--spec cypress/integration/drag-drop-demo/request.spec.js' yarn test:snapshot        # For Mac & Windows
CYPRESS_cmd='--spec cypress/integration/drag-drop-demo/request.spec.js' yarn test:snapshot:linux  # For Linux
```

More options: https://docs.cypress.io/guides/guides/command-line.html

## Testing in a local GUI, for debugging of the test runner without PNG snapshots

Before running the test runner GUI for the first time, you will need to install the Cypress app locally:

```
./node_modules/.bin/cypress install
```

Them, launch Cypress GUI using the command:

```
yarn test:gui
```

The Cypress window will open, in which you need to select "Chrome" from the browser selection menu and click "Run all specs".

## Automated testing with GitHub Actions

Testing on GitHub is performed automatically on each push.
