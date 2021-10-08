import './public-path';

import ParseWorker from './parse-worker/modern.worker';

import { run } from '.';

run(new ParseWorker());
