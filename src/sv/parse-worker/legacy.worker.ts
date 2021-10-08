// Load polyfills needed for IE11 & friends. Single CoreJS entry points that can be looked up at https://github.com/zloirock/core-js/blob/v2/README.md
import 'regenerator-runtime/runtime';
import 'core-js/es6/promise';
import 'core-js/fn/array/includes';
import 'core-js/fn/array/find';
import 'core-js/fn/object/assign';
import 'core-js/fn/object/entries';
import 'core-js/fn/string/starts-with';
import 'core-js/fn/typed/uint8-array';
import 'core-js/fn/map'; // To support the `new Map([iterable])` constructor.

// `fetch()` polyfill
import 'whatwg-fetch';

import { attach } from '.';

attach(self as any);

// See comment in `modern.worker.js`.
export default undefined as unknown as typeof WebpackWorker;
