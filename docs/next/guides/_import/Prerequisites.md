### Installing required tools

Make sure you have the following tools installed:

1. NodeJS 12.18.2
2. Yarn 1.22.4 (installed globally)
3. Docker Desktop 3.5.2

Other versions might work but were not tested.

### Cloning the repo

Clone the repo https://github.com/handsontable/spreadsheet-viewer-dev:

```bash
git clone git@github.com:handsontable/spreadsheet-viewer-dev.git
```

Use the **SSH** Git endpoint, because the HTTPS does not work that well for submodules.

### Installing the dependencies

To install the dependencies, simply run `yarn` in the repo root.

Yarn automatically executes the `prepare` script defined in `package.json` which pulls Git submodules in the subdirectory `./submodules` and installs their dependencies. When you do it for the first time, this process might take up to 5 minutes.

The following submodule is pulled each time you call `yarn`:

- https://github.com/handsontable/handsontable (our spreadsheet rendering engine, also known as HOT). SV uses a custom branch https://github.com/handsontable/handsontable/tree/sv, which is currently based on the PR branch https://github.com/handsontable/handsontable/pull/6157

To only update submodules without installing the NPM/Yarn packages, run `yarn prepare:submodules`.