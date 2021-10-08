// Modern, no polyfills required.

import { attach } from '.';

attach(self as any);

// Create a default export for module as `typeof WebpackWorker` to allow
// importing from other modules as exactly that (the `undefined` is replaced
// by Webpack itself)
export default undefined as unknown as typeof WebpackWorker;
