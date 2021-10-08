declare module '*.less' {
  const styles: string;

  export default styles;
}

// Originally this extended from `lib.dom.d.ts`'s `Worker`, but to override
// the typings we have to override the typings completely. This is fine
// because the API surface is rather small and we can always add more
// properties from the real `Worker` as needed.
declare class WebpackWorker<PostMessageType, OnMessageType> {
  constructor();

  postMessage(message: PostMessageType): void;

  addEventListener(type: 'message', listener: (event: {data: OnMessageType}) => void): void

  removeEventListener(type: 'message', listener: (event: {data: OnMessageType}) => void): void

  onmessage: (event: {data: OnMessageType}) => void;
}

// eslint-disable-next-line @typescript-eslint/camelcase
declare let __webpack_public_path__: string;
