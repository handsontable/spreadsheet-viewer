import './public-path';

// Load polyfills needed for IE11 & friends. Single CoreJS entry points that can be looked up at https://github.com/zloirock/core-js/blob/v2/README.md
import 'regenerator-runtime/runtime';

import 'core-js/es6/promise';
import 'core-js/es6/symbol';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/weak-set';
import 'core-js/fn/array/includes';
import 'core-js/fn/array/from';
import 'core-js/fn/array/fill';
import 'core-js/fn/array/find';
import 'core-js/fn/object/values';
import 'core-js/fn/object/assign';
import 'core-js/fn/object/entries';
import 'core-js/fn/string/includes';
import 'core-js/fn/string/starts-with';
import 'core-js/fn/number/is-integer';
import 'core-js/fn/number/is-nan';

import ParseWorker from './parse-worker/legacy.worker';

import { run } from '.';

if (typeof NodeList !== 'undefined' && NodeList.prototype && !NodeList.prototype.forEach) {
  // @ts-ignore
  NodeList.prototype.forEach = Array.prototype.forEach; // polyfill to make it possible to use querySelectorAll().forEach(), required by react-handsontable in IE11
}

run(new ParseWorker());
