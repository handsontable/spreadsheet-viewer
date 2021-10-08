import { COLORS } from './consoleReport';

interface ScriptArgs {
  newFileName: string | null;
  baselineFileName: string | null;
  numberOfSamples: number | null
}

const displayHelp = () => {
  console.log(`
    Supported commands:

    --output=example.csv
    When measurement is finished, create new file under 'perf/reports/generated/example.csv'
    --compare=example.csv
    When measurement is finished, results of measurement are compared with baseline results from file 'perf/reports/generated/example.csv'
  `);
};

const reportUnsupportedArgument = (argument: string) => {
  console.log(COLORS.yellow, `Malformed or unrecognized script argument was provided "${argument}".`);

  displayHelp();

  throw Error(`Unrecognized script argument "${argument}".`);
};

const parseArgument = (argument: string) => {
  const [arg, val] = argument.split('=');

  switch (arg) {
    case '--output': {
      return { newFileName: val };
    }
    case '--compare': {
      return { baselineFileName: val };
    }
    case '--number-of-samples': {
      const n = Number(val);
      return { numberOfSamples: Number.isNaN(n) ? null : n };
    }
    default: {
      reportUnsupportedArgument(arg);
    }
  }
};

export const getScriptArgs = (): ScriptArgs => {
  const scriptArgs = process.argv.slice(2).reduce((args, arg) => Object.assign(args, {
    ...parseArgument(arg)
  }), {
    baselineFileName: null,
    newFileName: null,
    numberOfSamples: null
  });

  return scriptArgs;
};
