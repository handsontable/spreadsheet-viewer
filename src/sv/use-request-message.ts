import { useEffect } from 'react';

import { Codec, exactly } from 'purify-ts/Codec';
import { InvalidRequestMessageError } from './error';

const templateCodec = (name: string) => Codec.interface({
  name: exactly(name)
});

export function useRequestMessage<Name extends string, T extends {name: Name}>(
  name: Name,
  codec: Codec<T>,
  onError: (error: InvalidRequestMessageError)=> void,
  callback: (arg: T) => void
) {
  useEffect(() => {
    const listener = ({ data }: {data: unknown}) => {
      // Skip all messages that don't have the `name` property
      if (templateCodec(name).decode(data).isLeft()) {
        return;
      }

      codec.decode(data).either(
        (failureReason) => {
          // If the decoding was unsuccessful, throw an error
          console.error(`Invalid request message \`${name}\` - ${failureReason}`);
          onError(new InvalidRequestMessageError(`Request message ${name} - ${failureReason}`));
        },
        // Otherwise call the passed callback function with the result
        t => callback(t)
      );
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [name, codec, onError, callback]);
}
