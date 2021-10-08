const path = require('path');
const { execSync } = require('child_process');
const { promises: fs } = require('fs');

const { BannerPlugin, EnvironmentPlugin, ProgressPlugin } = require('webpack');
const RawSource = require('webpack-sources/lib/RawSource');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pkgJson = require('./package');

const nodeEnv = (process.env.NODE_ENV || '').toLowerCase();
const isDevelopment = nodeEnv === 'development';
const isStaging = nodeEnv === 'staging';

const bundleEnv = process.env.BUNDLE;
const modernBundleEnabled = bundleEnv === undefined || bundleEnv === 'modern';
const legacyBundleEnabled = bundleEnv === undefined || bundleEnv === 'legacy';
const bothBundlesEnabled = legacyBundleEnabled && modernBundleEnabled;

const minimizeEnv = process.env.MINIMIZE;

const isCI = Boolean(process.env.CI);

const banner = () => {
  const { version } = pkgJson;
  const gitShaCommand = 'git rev-parse HEAD';
  const sha = execSync(gitShaCommand).toString().substring(0, 7);

  const dateConfig = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Europe/Warsaw',
    timeZoneName: 'short'
  };

  const buildDate = new Intl.DateTimeFormat('en-US', dateConfig).format(new Date());

  return `
Spreadsheet Viewer

Version: ${version}
Code version: ${sha}
Build date: ${buildDate}
  `.trim();
};

/**
 * This is a custom plugin that combines two Webpack compilers with `modern`
 * and `legacy` js bundles and emits an `index.html` with the contents of those
 * bundles.
 *
 * This is needed because
 * - `html-webpack-plugin` does not support multi
 *   compilers in Webpack (aka. exporting an array of configurations from
 *   webpack.config.js)
 * - generating an `index.html` manually outside of the Webpack build cycle is
 *   not idiomatic and could easily lead to problems with the way
 *   webpack-dev-server does not place the compilation files on disk, plus
 *   updating the custom `index.html` on new incremental compilations manually
 *   would be a pain.
 *
 * This plugin incrementally builds the desired `index.html` as the updated
 * `modern` and `legacy` bundles come in, defaulting to outputting empty
 * strings in the html before that.
 */
const SpreadsheetViewerIndexHtmlPlugin = () => {
  let legacyBundlePath;
  let modernBundleSource;

  const indexHtmlSrcPath = path.join(__dirname, 'src', 'sv', 'index.html');

  const legacyBundleRegexp = /^legacy.+bundle\.js$/;
  const modernBundleRegexp = /^modern.+bundle\.js$/;

  return {
    apply(compiler) {
      compiler.hooks.emit.tapPromise('SpreadsheetViewerIndexHtmlPlugin', async(compilation) => {
        // Find either the legacy or modern bundle, since we're attaching this
        // plugin into two separate Webpack compilers, exactly one of these
        // will (and must) be present upon each call of this function.
        const legacyBundleAsset = compilation.getAssets().find(({ name }) => legacyBundleRegexp.test(name));
        legacyBundlePath = legacyBundleAsset ? legacyBundleAsset.name : legacyBundlePath;

        const modernBundleAsset = compilation.getAssets().find(({ name }) => modernBundleRegexp.test(name));
        modernBundleSource = modernBundleAsset
          ? modernBundleAsset.source.source().replace('</script>', '')
          : modernBundleSource;

        if (legacyBundleAsset === undefined && modernBundleAsset === undefined) {
          throw new Error('Could not find either the legacy bundle or the modern bundle in the compilation about to be emitted');
        }

        if (bothBundlesEnabled && (!legacyBundlePath || !modernBundleSource)) {
          return;
        }

        const indexHtmlSrc = await fs.readFile(indexHtmlSrcPath, 'utf8');

        const emittedIndexHtml = indexHtmlSrc
          // Function as a second param because of
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
          // (3 hours of my life that I'll never get back)
          .replace('%modernBundleSource%', () => modernBundleSource || '')
          .replace('%legacyBundlePath%', () => legacyBundlePath || '');

        compilation.emitAsset('index.html', new RawSource(emittedIndexHtml));
      });
    }
  };
};

const output = prefix => ({
  filename: `${prefix}.[name].[contenthash].bundle.js`,
  chunkFilename: `${prefix}.[name].[contenthash].chunk.js`,
  path: path.resolve(__dirname, 'dist/sv')
});

// Initialize here so that we can share this plugin's instance across Webpack compilers
const spreadsheetViewerIndexHtmlPlugin = SpreadsheetViewerIndexHtmlPlugin();

const stylesRegex = /src[\\/]sv[\\/]styles[\\/].*\.less/;

const createConfig = ({ modern, minimize, showProgress = false }) => ({
  entry: `./src/sv/entry.${modern ? 'modern' : 'legacy'}.ts`,
  output: output(modern ? 'modern' : 'legacy'),
  mode: isDevelopment ? 'development' : 'production',
  optimization: {
    minimize
  },
  devtool: isDevelopment ? 'eval-source-map' : false,
  devServer: {
    allowedHosts: [
      // For test:snapshot locally
      'host.docker.internal',

      // For GitHub actions
      '172.17.0.1'
    ],
    port: 5000,
    inline: false,
    liveReload: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      handsontable: path.resolve(__dirname, 'submodules/handsontable/src/index.js')
    }
  },
  plugins: [
    spreadsheetViewerIndexHtmlPlugin,
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].extracted.css',
      chunkFilename: '[name].[contenthash].extracted.chunk.css',
    }),
    !isCI && showProgress && new ProgressPlugin(),
    new BannerPlugin({ banner }),
    new EnvironmentPlugin({
      // https://webpack.js.org/plugins/environment-plugin/#usage-with-default-values
      // Default `process.env.NODE_ENV` to `production` (unless it's already defined)
      NODE_ENV: 'production'
    })
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        loader: 'worker-loader'
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,

        // Exclude all node_modules, except @handsontable/js-xlsx.
        // The `[\\/]` part of the regex is to support both Unix and Windows
        // style paths.
        exclude: /node_modules(?![\\/]@handsontable[\\/]js-xlsx)/,

        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: modern
              ? [['@babel/env', {
                targets: {
                  esmodules: true
                }
              }]]
              : [['@babel/env', { targets: '> 0.25%' }]],
            plugins: [
              // Plugins used for compiling Handsontable
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-optional-chaining',
            ]
          }
        }
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader'
      },
      {
        // Files specifically in the src/sv/styles folder - we want to switch
        // between the <theme>.less entrypoints at runtime dynamically, the
        // below loaders achieve that through placing the compiled .css files
        // in the output next to the bundle file and exposing the content hash
        // paths to them to the runtime so that we can easily include them with
        // <link rel="stylesheet" href={contentPath} /> in React or whatever.
        test: stylesRegex,
        use: [{ loader: 'file-loader', options: { name: '[name].[contenthash].css' } }, 'extract-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(css|less)$/,
        exclude: stylesRegex,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash].[ext]'
        }
      }
    ]
  }
});

// Only show progress if one bundle is enabled
const showProgress = !bothBundlesEnabled;

const minimize = minimizeEnv === undefined ? !isDevelopment : (minimizeEnv === 'true');

console.log(`
--- Build info
bundle.legacy       = '${legacyBundleEnabled}'
bundle.modern       = '${modernBundleEnabled}'
minimize            = '${minimize}'
mode                = '${isDevelopment ? 'development' : 'production'}'
performance markers = '${isStaging || isDevelopment}'
---
`);

module.exports = [
  legacyBundleEnabled && createConfig({ modern: false, minimize, showProgress }),
  modernBundleEnabled && createConfig({ modern: true, minimize, showProgress })
].filter(Boolean);
