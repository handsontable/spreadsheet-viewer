declare module 'testingbot-tunnel-launcher' {
  type Options = {
    apiKey: string
    apiSecret: string
    verbose?: boolean
  };

  export type TestingBotTunnel = {
    close: (callback?: () => void) => void
  };

  const downloadAndRun: (options: Options, callback: (err: Error | undefined, tunnel: TestingBotTunnel) => void) => void;

  export default downloadAndRun;
}
