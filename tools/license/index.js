/* eslint-disable max-len */
/*
This tool creates a summary of open source licences of the first-level dependencies + devDependencies
that are included in the Webpack bundles.

It does the following things:

1. create a file all-imports.txt that lists all JS imports found in dist/sv
2. write to STDOUT the names of the first-level dependencies
3. create a file legally.txt that lists all FOSS licenses of projects dependencies
4. write to STDOUT the licenses of the first-level dependencies

The tool was created on Mac with Node 14. It was last tested on Windows with Node 14

How to run:

$ node index.js
*/

const fs = require('fs');
const { execSync } = require('child_process');
const package = require('../../package.json');

console.log('Installing dependencies and making a fresh build...');
// execSync('yarn clean-build', { env: { MINIMIZE: 'false', cwd: `${__dirname}../..` } });

const pathToBash = process.platform === 'win32' ? 'C:\\Program Files\\Git\\bin\\bash.exe' : '/bin/bash';

console.log('Finding Webpack import markers...');
execSync('grep -hri "/\\*\\*\\*/ \\"." ../../dist/sv > all-imports-raw.txt', { shell: pathToBash });
execSync('grep -hri "// EXTERNAL MODULE" ../../dist/sv >> all-imports-raw.txt', { shell: pathToBash });
execSync('grep -hri "// CONCATENATED MODULE" ../../dist/sv >> all-imports-raw.txt', { shell: pathToBash });
execSync('cat all-imports-raw.txt | sed \'s/":$//\' | sed \'s/^\\/\\*\\*\\*\\/ "//\' | sed \'s/^\\/\\/ EXTERNAL MODULE: //\' | sed \'s/^\\/\\/ CONCATENATED MODULE: //\' > all-imports-unsorted.txt', { shell: pathToBash });
execSync('sort all-imports-unsorted.txt | uniq  > all-imports.txt', { shell: pathToBash });
execSync('rm all-imports-raw.txt all-imports-unsorted.txt');

const firstLevelDeps = Object.keys(package.devDependencies);
const depsInBundle = fs.readFileSync('all-imports.txt', 'utf8').split('\n');
const foundFirstLevelDepsInBundle = [];
const notFoundFirstLevelDepsInBundle = [];

firstLevelDeps.forEach((name) => {
  let found = false;
  for (let i = 0; i < depsInBundle.length; i++) {
    if (depsInBundle[i].includes(`/${name}/`) || depsInBundle[i].includes(`/_@${name}@/`) || depsInBundle[i].includes(`@${name}/`) || depsInBundle[i].includes(`/${name}!`)) {
      found = true;
      break;
    }
  }

  if (found) {
    foundFirstLevelDepsInBundle.push(name);
  } else {
    notFoundFirstLevelDepsInBundle.push(name);
  }
});

console.log('These first level deps were not found in the bundles', notFoundFirstLevelDepsInBundle);
console.log('These first level deps were found in the bundles', foundFirstLevelDepsInBundle);
if (foundFirstLevelDepsInBundle.length === 0) {
  console.error('Something went wrong. I expected at least one result found');
  process.exit();
}

console.log('Building a lookup file with open-source licences found in the bundles...');
execSync('cd ../.. && npx legally --width 120 > legally.txt', { shell: pathToBash });
execSync('mv ../../legally.txt legally.txt', { shell: pathToBash });
// sample output presented in https://gist.github.com/warpech/aa3d91914d01fbf5698e7acbd526ba95

console.log('Making license analysis of the first-level dependencies...');
const legally = fs.readFileSync('legally.txt', 'utf8').split('\n');
foundFirstLevelDepsInBundle.forEach((name) => {
  for (let i = 0; i < legally.length; i++) {
    if (legally[i].includes(` ${name}@`)) {
      console.log(legally[i]);
    }
  }
});

