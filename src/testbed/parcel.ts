import Bundler from 'parcel-bundler';
import Path from 'path';
import { runPostBuildScripts } from './postbuild';

const entryFiles = Path.join(__dirname, './index.html');

if (process.env.NODE_ENV === 'development') {
  const options = {};
  const bundler = new Bundler(entryFiles, options);
  bundler.on('buildEnd', async() => {
    await runPostBuildScripts();
  });
  bundler.serve();
} else if (process.env.NODE_ENV === 'production') {
  const options = {
    cache: false,
    sourceMaps: false,
    detailedReport: true,
  };
  const bundler = new Bundler(entryFiles, options);
  bundler.on('bundled', () => async() => {
    await runPostBuildScripts();
  });
  bundler.bundle();
} else if (process.env.NODE_ENV === 'staging') {
  const options = {
    cache: false,
    sourceMaps: false,
    detailedReport: false,
    hmr: false,
    watch: false,
    minify: true,
  };
  const bundler = new Bundler(entryFiles, options);
  bundler.on('buildEnd', async() => {
    await runPostBuildScripts();
  });

  bundler.serve();
}
