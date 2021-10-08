// This script generates a Spreadsheet Viewer zip package, intended for
// distribution to end clients.
//
// Works on a simple whitelist basis, as this solution is way simpler than
// trying to work with `.gitignore` (we would need to include some ignored
// files in the zip anyways).

const path = require('path');
const { promises: fs } = require('fs');

const JSZip = require('jszip');
const bytes = require('bytes');
const chalk = require('chalk');
const execa = require('execa');
const fg = require('fast-glob');

const outputPath = 'SpreadsheetViewer.zip';

const globs = [
  'index.html',
  'README.md',
  'Spreadsheet Viewer.pdf',

  'common/**',

  'spreadsheet-viewer/**',

  'examples/js/*',

  'examples/react/*',
  'examples/react/src/**',
  'examples/react/dist/**',

  'examples/vue/*',
  'examples/vue/src/**',
  'examples/vue/dist/**',

  'examples/angular/*',
  'examples/angular/src/**',
  'examples/angular/dist/**',

  '!**/.DS_Store',

  '!**/node_modules'
];

const reportDirectories = (files) => {
  const dirs = files.map(file => path.dirname(file)).sort();

  const uniqDirsWithCounts = dirs.reduce((map, cv) => {
    const existing = map.get(cv) || 0;
    return map.set(cv, existing + 1);
  }, new Map());

  const sorted = [...uniqDirsWithCounts.entries()].sort((a, b) => b[1] - a[1]);

  return sorted.map(([dir, count]) => `- (${count}) ${dir}`).join('\n');
};

const main = async() => {
  const log = (...msgs) => console.log(chalk.blue('[prepare-zip]'), ...msgs);

  log('cwd:', process.cwd());

  log('running yarn...');
  await execa('yarn', { stdio: 'inherit' });

  log('running build scripts...');
  await execa('yarn', ['workspaces', 'run', 'build'], { stdio: 'inherit' });

  const files = await fg(globs);

  const zip = new JSZip();

  for (const file of files) {
    zip.file(file, await fs.readFile(file));
  }

  log(`zip contents: \n${reportDirectories(files)}`);

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

  const prettySize = bytes.format(zipBuffer.byteLength);

  await fs.writeFile('SpreadsheetViewer.zip', zipBuffer);

  log(`written to: ${outputPath} (${prettySize})`);
};

main();
