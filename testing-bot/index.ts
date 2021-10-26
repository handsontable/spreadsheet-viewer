/* eslint-disable no-await-in-loop, no-restricted-syntax */

import path from 'path';
import { PNG, PNGWithMetadata } from 'pngjs';
import { promises as fs } from 'fs';
import * as fsOld from 'fs';

import isReachable from 'is-reachable';
import {
  Either, Right, Left
} from 'purify-ts';
import * as webdriver from 'selenium-webdriver';
import * as dotenv from 'dotenv';
import pSeries from 'p-series';
import pixelmatch from 'pixelmatch';
import testingbotTunnelLauncher, { TestingBotTunnel } from 'testingbot-tunnel-launcher';
import { prompt } from 'enquirer';

type Scenario = {
  /**
   * This id will be used as the name of the png snapshot.
   */
  id: string

  /**
   * The window size that will be set right after starting the test. Strongly
   * recommended to not pass in `undefined` unless it's a mobile device, where
   * the resize will have no effect.
   *
   * [width, height]
   */
  windowSize: [number, number] | undefined

  /**
   * Optional crop to apply to the snapshot. This is useful for mobile devices
   * that only support fullscreen screenshots which include dynamic elements
   * such as the clock.
   *
   * Note that this will effectively disable the size check, unless the source
   * image is smaller than the crop area needs it to be.
   *
   * [x1, y1, x2, y2]
   */
  crop?: [number, number, number, number]

  /**
   * Browser capabilities used to tell TestingBot which browser and OS we
   * want.
   *
   * Sources:
   * https://testingbot.com/support/getting-started/nodejs.html#capabilities
   * https://testingbot.com/support/getting-started/browsers.html
   */
  caps: [string, string][]

  /**
   * How many times to attempt and ignore Webdriver errors. This is needed
   * as it seems like some devices are flaky, especially the simulators.
   */
  retries?: number
};

const scenarios: Scenario[] = [
  {
    id: 'win10-ie11',
    windowSize: [1600, 1200],
    retries: 3,
    caps: [
      ['platform', 'WIN10'],
      ['version', '11'],
      ['browserName', 'internet explorer'],
      ['screen-resolution', '1920x1080']
    ]
  },
  {
    id: 'macoscatalina-safari13',
    windowSize: [1600, 2000],
    caps: [
      ['platform', 'CATALINA'],
      ['version', '13'],
      ['browserName', 'safari'],
      ['screen-resolution', '1920x1080']
    ]
  },
  {
    id: 'win10-firefox',
    windowSize: [1600, 1200],
    caps: [
      ['platform', 'WIN10'],
      ['version', '82'],
      ['browserName', 'firefox']
    ]
  },
  {
    id: 'ios14-safari',
    windowSize: undefined,

    // Includes just the browser viewport without Safari navigation or top
    // bar (and especially the clock).
    crop: [0, 196, 828, 1626],

    retries: 3,
    caps: [
      ['browserName', 'safari'],
      ['platform', 'iOS'],
      ['version', '14.0'],
      ['platformName', 'iOS'],
      ['deviceName', 'iPhone 11']
    ]
  },
  // {
  //   id: 'android10-pixel3-chrome',
  //   windowSize: undefined,
  //   retries: 3,
  //   caps: [
  //     ['browserName', 'Chrome'],
  //     ['platform', 'Android'],
  //     ['version', '10.0'],
  //     ['platformName', 'Android'],
  //     ['deviceName', 'Pixel 3']
  //   ]
  // }
];

/**
 * Creates a TestingBot tunnel, alive for the duration of the Promise
 * returned from the callback.
 *
 * The tunnel creates a secure connection from a local machine to the
 * TestinBot cloud, which results in the remote machines having access to
 * ports on the current `localhost`.
 */
const withTunnel = <T>(
  apiKey: string,
  apiSecret: string
) => async(
    callback: (endpoint: string) => Promise<T>
  ): Promise<T> => {
    console.log('Launching the TestingBot tunnel...');
    console.log('- You might need to install Java (`brew install java` on a Mac, remember about the remaining instructions in the Caveats section after installing!)');
    console.log(
      '- If it keeps failing to start there might be too many tunnels already connected to TestingBot (4 max allowed at a time).',
      'To force remove them, visit https://testingbot.com/members/tunnels and click delete.'
    );

    const tunnel = await new Promise<TestingBotTunnel>((resolve, reject) => {
      testingbotTunnelLauncher({
        apiKey,
        apiSecret
      }, (error, tunnel_) => {
        if (error) {
          return reject(error);
        }

        resolve(tunnel_);
      });
    });

    const endpoint = `http://${apiKey}:${apiSecret}@localhost:4445/wd/hub`;

    const closeTunnel = (result: T): Promise<T> => new Promise(
      // Clean up the tunnel once the promise returned from the passed in
      // function is resolved.
      resolve => tunnel.close(() => resolve(result))
    );

    return callback(endpoint).then(closeTunnel).catch(closeTunnel);
  };

const parseArgv = (argv: string[]) => {
  const a = argv.map<[string, string] | undefined>((maybeOption) => {
    const maybeOptionSplit = maybeOption.split('=');
    if (maybeOptionSplit.length !== 2) {
      return undefined;
    }

    return [maybeOptionSplit[0], maybeOptionSplit[1]];
  }).filter((x): x is [string, string] => Array.isArray(x));

  return new Map(a);
};

type ExecutionMode = 'compare' | 'regenerate';
type TestSettings = {
  scenariosToRun: Scenario[]
  executionMode: ExecutionMode
};

const enquireUserForTestSettings = async(argv: string[]): Promise<TestSettings> => {
  const args = parseArgv(argv);
  const executionMode: ExecutionMode = await (async() => {
    const flag = '--execution-mode';
    const arg = args.get(flag);

    if (arg !== undefined) {
      if (arg === 'compare') {
        return 'compare';
      }

      if (arg === 'regenerate') {
        return 'regenerate';
      }
    }

    const { answer }: {answer: ExecutionMode} = await prompt({
      type: 'autocomplete',
      name: 'answer',
      message: `Choose snapshot execution mode (${flag}=<compare|regenerate> to override)`,
      choices: ['compare', 'regenerate']
    });

    return answer;
  })();

  const scenarioNameToRun: string = await (async() => {
    const flag = '--scenario';

    const arg = args.get(flag);

    if (arg !== undefined) {
      return arg;
    }

    const { answer }: {answer: string} = await prompt({
      type: 'autocomplete',
      name: 'answer',
      message: `Choose scenario(s) to run (${flag}=... to override)`,
      choices: ['all', ...scenarios.map(({ id }) => id)]
    });

    return answer;
  })();

  const scenariosToRun: Scenario[] = (() => {
    if (scenarioNameToRun === 'all') {
      return scenarios;
    }

    const maybeScenario = scenarios.find(({ id }) => id === scenarioNameToRun);

    if (maybeScenario === undefined) {
      const availableScenarios = scenarios.map(({ id }) => id).join(', ');
      throw new TypeError(`Could not find a scenario with the name ${scenarioNameToRun} (available: ${availableScenarios})`);
    }

    return [maybeScenario];
  })();

  return {
    scenariosToRun,
    executionMode
  };
};

type ScenarioResult = {
  id: string,
  either: Either<Error, undefined>
};

const randomId = () => Math.random().toString(32).substring(2);

const getSnapshotPathForId = (id: string): string => path.join(__dirname, 'snapshots', `${id}.png`);
const diffSnapshotsDir = path.join(__dirname, '__diff_output__');
const getSnapshotDiffPathForId = (id: string): string => path.join(diffSnapshotsDir, `${id}-${randomId()}.png`);

const writeFileWithParentDirectories = (destination: string, data: string | Buffer, encoding: BufferEncoding | undefined): void => {
  const dir = path.dirname(destination);
  fsOld.mkdirSync(dir, { recursive: true });
  fsOld.writeFileSync(destination, data, encoding);
};

const fileExists = (p: string): Promise<boolean> => fs.access(p).then(() => true).catch(() => false);

const maybeReadBase64File = async(p: string): Promise<string | undefined> => {
  const exists = await fileExists(p);

  if (exists) {
    return fs.readFile(p, 'base64');
  }

  return undefined;
};

const cropPNG = (x1:number, y1:number, x2:number, y2: number, inputPNG: PNG): PNG => {
  const width = Math.abs(x1 - x2);
  const height = Math.abs(y1 - y2);
  const outputPNG = new PNG({ width, height });

  PNG.bitblt(inputPNG, outputPNG, Math.min(x1), Math.min(y1), width, height, 0, 0);

  return outputPNG;
};

const retryPromiseIf = <T>(
  /**
   * Called everytime the Promise returned from the `promiseFn` function gets
   * rejected, expected to return a boolean to indicate whether to keep
   * retrying or not.
   */
  onRejected: (reason: unknown) => Promise<boolean> | boolean
) => (promiseFn: () => Promise<T>): Promise<T> => {
    const attempt = (): Promise<T> => promiseFn().catch(async(rejection) => {
      const shouldKeepRetrying = await onRejected(rejection);

      if (shouldKeepRetrying) {
        return attempt();
      }

      return Promise.reject(rejection);
    });

    return attempt();
  };

const delay = (t: number) => new Promise(resolve => setTimeout(resolve, t));

const takeSnapshotInScenario = async(seleniumEndpoint: string, scenario: Scenario): Promise<Either<Error, PNG>> => {
  const caps = new webdriver.Capabilities(new Map(scenario.caps));
  caps.set('maxduration', 60);

  try {
    const driver: webdriver.WebDriver = await retryPromiseIf<webdriver.WebDriver>(async(error) => {
      const maxConcurrencyLimitMessage = 'You are currently at the limit of the max allowed';

      if (error instanceof Error && error.message.includes(maxConcurrencyLimitMessage)) {
        // If we're over the global concurrency limit, wait 10 seconds and retry building the driver.
        console.log('Over TestingBot concurrency limit, retrying in 10 seconds.');
        await delay(10000);

        return true;
      }

      return false;
    })(() => {
      console.log('Building Webdriver...');

      return new webdriver.Builder()
        .usingServer(seleniumEndpoint)
        .withCapabilities(caps)
        .build();
    });

    const session = await driver.getSession();
    console.log('| View this test live at:');
    console.log(`| https://testingbot.com/members/tests/${session.getId()}`);

    if (scenario.windowSize !== undefined) {
      const [w, h] = scenario.windowSize;
      console.log(`Resizing the browser window to ${w}x${h}px`);
      await driver.manage().window().setRect({
        width: w,
        height: h
      });
    }

    console.log('Getting the Spreadsheet Viewer page...');
    await driver.get('http://localhost:5000/#workbookUrl=/cypress/fixtures/styling.xlsx');

    console.log('Waiting for Spreadsheet Viewer to render its contents');
    await driver.wait(
      webdriver.until.elementLocated(webdriver.By.css('.ht_master td')),
      30000
    );

    // Android Chrome displays a scrollbar when a scrollable area appears, such
    // as in the case of rendering Handsontable with width larger than the
    // viewport width. This delay simply waits for the scrollbar to fade out.
    await delay(1000);

    console.log('Taking the snapshot...');
    const snapshot = await driver.takeScreenshot();
    const png = PNG.sync.read(Buffer.from(snapshot, 'base64'));

    console.log('Quitting driver...');
    await driver.quit();

    if (scenario.crop) {
      const [x1, x2, y1, y2] = scenario.crop;
      return Right(cropPNG(x1, x2, y1, y2, png));
    }

    return Right(png);
  } catch (error) {
    console.error(`Failed to take snapshot of scenario ${scenario.id}`);

    return Left(error);
  }
};

const regenerateSnapshots = async(seleniumEndpoint: string, scenariosToRun: Scenario[]): Promise<number> => {
  const snapshots: Either<{
    id: string,
    error: Error
  }, {
    id: string
    png: PNG
  }>[] = await pSeries(scenariosToRun.map((scenario, index) => async() => {
    console.log(`Running scenario ${scenario.id} (${index + 1}/${scenariosToRun.length})...`);

    return (await takeSnapshotInScenario(seleniumEndpoint, scenario))
      .bimap(error => ({
        id: scenario.id,
        error
      }), png => ({
        id: scenario.id,
        png
      }));
  }));

  for (const snapshot of snapshots) {
    snapshot.either(({ id, error }) => {
      console.error(`Failed to regenerate snapshot for scenario ${id}`);
      console.error(error);
    }, ({ id, png }) => {
      const destination = getSnapshotPathForId(id);
      console.log(`Writing ${destination}`, fileExists(destination) ? '' : '(new file)');

      writeFileWithParentDirectories(destination, PNG.sync.write(png), 'base64');
    });
  }

  const failedSnapshotAmount = Either.lefts(snapshots).length;

  return failedSnapshotAmount;
};

/**
 * Takes an *n* amount of tries to take and a function that returns a
 * Promise<Either<*, *>>. The function will be executed *n* times, up until the
 * returned Either is an instance of Right.
 */
const retryPromiseEither = <L, R>(retriesLeft: number) => async(fn: (retriesLeft: number) => Promise<Either<L, R>>): Promise<Either<L, R>> => {
  const result = await fn(retriesLeft);

  return result.either((v) => {
    if (retriesLeft === 0) {
      return Promise.resolve(Left(v));
    }

    return retryPromiseEither<L, R>(retriesLeft - 1)(fn);
  }, (x) => {
    return Promise.resolve(Right(x));
  });
};

const compareSnapshots = async(seleniumEndpoint: string, scenariosToRun: Scenario[]): Promise<number> => {
  console.log(`Removing the diff snapshots directory if it exists ${diffSnapshotsDir}`);
  if (await fileExists(diffSnapshotsDir)) {
    await fs.rmdir(diffSnapshotsDir, { recursive: true });
  }

  const results: ScenarioResult[] = await pSeries(
    scenariosToRun.map((scenario, index) => async() => {
      const snapshotPath = getSnapshotPathForId(scenario.id);
      const existingSnapshot = await maybeReadBase64File(snapshotPath);

      if (existingSnapshot === undefined) {
        return {
          id: scenario.id,
          either: Left(new Error(`Couldn't find an existing snapshot to compare to at ${snapshotPath} (need to regenerate snapshots)`))
        };
      }

      console.log(`Running scenario ${scenario.id} (${index + 1}/${scenariosToRun.length})`);

      const totalRetries = scenario.retries ?? 0;
      const retriesCompareResultEither = await retryPromiseEither<Error, undefined>(totalRetries)(async(retriesLeft) => {
        if (totalRetries > 0) {
          console.log(`Retries left for scenario ${scenario.id}: ${retriesLeft}/${totalRetries}`);
        }

        const snapshotEither = await takeSnapshotInScenario(seleniumEndpoint, scenario);

        const compareResultEither = snapshotEither.chain((actualSnapshotPNG) => {
          const expectedSnapshotPNG = PNG.sync.read(Buffer.from(existingSnapshot, 'base64'));

          if (actualSnapshotPNG.height !== expectedSnapshotPNG.height || actualSnapshotPNG.width !== expectedSnapshotPNG.width) {
            const actual = `${actualSnapshotPNG.width}x${actualSnapshotPNG.height}px`;
            const expected = `${expectedSnapshotPNG.width}x${expectedSnapshotPNG.height}px`;

            return Left(new Error(`Actual image dimensions (${actual}) don't match the expected dimensions (${expected})`));
          }

          const { width, height } = actualSnapshotPNG;
          const diffPNG = new PNG({ width, height });

          const differentPixelsAmount = pixelmatch(actualSnapshotPNG.data, expectedSnapshotPNG.data, diffPNG.data, width, height);

          if (differentPixelsAmount > 0) {
            // The image is different
            const totalPixels = width * height;
            const diffPercentage = (differentPixelsAmount / totalPixels) * 100;
            const roundedDiffPercentage = (Math.ceil(diffPercentage * 100)) / 100;

            const snapshotDiffPath = getSnapshotDiffPathForId(scenario.id);
            console.log('Writing diff to', snapshotDiffPath);
            writeFileWithParentDirectories(snapshotDiffPath, PNG.sync.write(diffPNG), 'utf8');

            return Left(new Error(`Images were different (${roundedDiffPercentage}%, ${differentPixelsAmount} pixels)`));
          }

          return Right(undefined);
        });

        compareResultEither.either((error) => {
          console.log(error);
          console.log(`Scenario ${scenario.id} failed.`);
          if (retriesLeft > 0) {
            console.log('Retrying scenario.');
          }
        }, () => {
          console.log(`Scenario ${scenario.id} completed successfully!`);
        });

        return compareResultEither;
      });

      return retriesCompareResultEither.either(error => ({
        id: scenario.id,
        either: Left(error)
      }), value => ({
        id: scenario.id,
        either: Right(value)
      }));
    })
  );

  for (const result of results) {
    result.either.either((error) => {
      console.log(`- ${result.id} - Failed`);
      console.log(error);
    }, () => {
      console.log(`- ${result.id} - Success`);
    });
  }

  const failedSnapshotAmount = Either.lefts(results.map(({ either }) => either)).length;
  if (failedSnapshotAmount > 0) {
    console.log('Failed to compare snapshots.');
  } else {
    console.log('Success!');
  }

  return failedSnapshotAmount;
};

const main = async() => {
  if (!(await isReachable('http://localhost:5000'))) {
    console.error('You need to start the Spreadsheet Viewer server on port 5000 to run this program, either via `yarn start` or `yarn serve:sv`.');
    process.exit(1);
  }

  dotenv.config({
    path: path.resolve(__dirname, '.env')
  });

  const tbSecretConfigProperty = 'TESTING_BOT_SECRET';
  const tbKeyConfigProperty = 'TESTING_BOT_KEY';

  const tbSecret = process.env[tbSecretConfigProperty];
  const tbKey = process.env[tbKeyConfigProperty];

  if (tbSecret === undefined || tbKey === undefined) {
    console.error(`
You need to provide credentials in order to run the TestingBot test suite.
To do that, put the following in the file \`testing-bot/.env\`:

${tbSecretConfigProperty}=...
${tbKeyConfigProperty}=...

You can also provide those credentials as environment variables, which will override whatever is in the \`.env\` file.

You can obtain the credentials at https://testingbot.com/members/user/edit
`);

    process.exit(1);
  }

  const settings = await enquireUserForTestSettings(process.argv.slice(2));

  const failedSnapshotAmount = await withTunnel<number>(tbKey, tbSecret)(async(seleniumEndpoint) => {
    // eslint-disable-next-line default-case
    switch (settings.executionMode) {
      case 'regenerate': {
        console.log('Regenerating snapshots...');
        return regenerateSnapshots(seleniumEndpoint, settings.scenariosToRun);
      }

      case 'compare': {
        console.log('Comparing snapshots...');
        return compareSnapshots(seleniumEndpoint, settings.scenariosToRun);
      }
    }
  });

  // Exit code equal to the number of failed snapshots, the same behavior as
  // Cypress.
  process.exit(failedSnapshotAmount);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
