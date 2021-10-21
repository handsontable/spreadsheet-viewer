### Updating dist

To update the Spreadsheet Viewer version for use in this project, rebuild Spreadsheet Viewer in `<root>/dist` (by calling `yarn build` in `<root>`) and then run `yarn build` again in `<root>/src/quickstart`.

### Creating ZIP package

The below command creates the file `SpreadsheetViewer.zip` from the repo root:

```
yarn && yarn prepare-zip
```

### Testing ZIP package manually

```
rm -rf dist
unzip SpreadsheetViewer.zip -d dist
python -m http.server -d dist 8080
```

### Testing without packaging

Note that this is not recommended for end users as it requires Yarn. Individual examples can be built just with `npm`.

```
yarn workspaces run build
python -m http.server 8080
```

### Remove build files

The following command removes build files `examples/.../dist` as well as `node_modules`:

```
git clean -xdf
```
