import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import packageJson from '../../package.json';

const { resolve } = require('path');
const { readdir } = require('fs').promises;

const gitShaCommand = 'git rev-parse HEAD';
const distPath = path.join(__dirname, 'dist');
const demoPath = path.join(distPath, 'src', 'testbed');
const svPath = path.join(__dirname, '..', '..', 'dist', 'sv');
// const sourceFixturesPath = path.join(__dirname, '..', '..', 'cypress', 'fixtures');
// const distFixturesPath = path.join(distPath, 'cypress', 'fixtures');
const distSvAssetsPath = path.join(distPath, 'sv-assets');

type BuildInfo = {
  version: string,
  sha: string,
  date: string
};

const findFilesFromDir = (dir: string): string[] => {
  const filesAndDirs = fs.readdirSync(dir).map(file => path.join(dir, file));
  const files = filesAndDirs.filter(pathToFileOrDir => fs.lstatSync(pathToFileOrDir).isFile());
  return files;
};

async function findFilesFromDirRecursive(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? findFilesFromDirRecursive(res) : res;
  }));
  return Array.prototype.concat(...files);
}

const insertBuildInfo = (file: string, content: string, info: BuildInfo) => {
  if (content.match(/%VERSION%|%CODE_VERSION%|%BUILD_DATE%/)) {
    const { version, sha, date } = info;
    let newContent = content.replace(/%VERSION%/g, version);
    newContent = newContent.replace(/%CODE_VERSION%/g, sha);
    newContent = newContent.replace(/%BUILD_DATE%/g, date);
    fs.writeFileSync(file, newContent);
  }
};

const bannerTemplate = `/*!
Version: %VERSION%
Code version: %CODE_VERSION%
Build date: %BUILD_DATE%
*/

`;

const addBannerTemplate = (content: string) => {
  return bannerTemplate + content;
};

const processedExtensions = ['.html', '.css', '.js'];

const { version } = packageJson;
const sha = execSync(gitShaCommand).toString().substring(0, 7);
const dateConfig = {
  weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'Europe/Warsaw', timeZoneName: 'short'
};
const date = new Intl.DateTimeFormat('en-US', dateConfig).format(new Date());

const buildInfo: BuildInfo = {
  version,
  sha,
  date
};

const copyFileIfOutdated = (file, sourcePathFragment, destPathFragment) => {
  const dest = file.replace(sourcePathFragment, destPathFragment);
  const existsOnDestination = fs.existsSync(dest);
  const needsReplacingOnDestination = !existsOnDestination || fs.statSync(file).mtime > fs.statSync(dest).mtime;
  if (needsReplacingOnDestination) {
    const directoryName = path.dirname(dest);

    if (!fs.existsSync(directoryName)) {
      fs.mkdirSync(directoryName, { recursive: true });
    }

    fs.copyFileSync(file, dest);
  }
};

export const runPostBuildScripts = async() => {
  const files = [
    ...findFilesFromDir(distPath),
    ...findFilesFromDir(demoPath)
  ];

  // add build information banners
  files.forEach((file) => {
    if (!file || !processedExtensions.some(ext => file.endsWith(ext))) {
      return;
    }

    let content = fs.readFileSync(file, 'utf8');
    if ((file.endsWith('css') || file.endsWith('js')) && !content.startsWith('/*!')) {
      content = addBannerTemplate(content);
    }
    insertBuildInfo(file, content, buildInfo);
  });

  // copy test fixtures to dist/
  /* findFilesFromDir(sourceFixturesPath).forEach((file) => {
    if (!file || !(file.endsWith('xls') || file.endsWith('xlsx'))) {
      return;
    }

    copyFileIfOutdated(file, sourceFixturesPath, distFixturesPath);
  }); */

  // copy submodule/spreadsheet-viewer-dev/dist to dist/sv-assets
  const svPathFiles = await findFilesFromDirRecursive(svPath);
  Array.from(svPathFiles).forEach((file) => {
    if (!file || file.endsWith('xls') || file.endsWith('xlsx') || file.includes('testbed')) {
      return;
    }

    if (!fs.existsSync(distSvAssetsPath)) {
      fs.mkdirSync(distSvAssetsPath);
    }

    copyFileIfOutdated(file, svPath, distSvAssetsPath);
  });
};

if (process.mainModule.filename === __filename) {
  runPostBuildScripts(); // self-run this module if called as Node entry point through `yarn postbuild`
}
