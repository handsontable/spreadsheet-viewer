// Use an `AbortController` "polyfill", which doesn't actually implement the
// abort functionality but is a just a stub that won't crash older browsers.
import 'abortcontroller-polyfill';
import { Either, Left, Right } from 'purify-ts/Either';

const fileLoadingTimeout = 30000;

// Some HTTP servers include additional information after semicolon, e.g.
// 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;
// charset=utf-8'
const getMimeTypeFromHeaders = (headers: Headers): string | undefined => headers.get('content-type')?.split(';')[0] || undefined;

const getContentLengthFromHeaders = (headers: Headers): number | undefined => {
  const header = headers.get('content-length');

  if (header === null) {
    return undefined;
  }

  const parsed = Number(header);

  return isNaN(parsed) ? undefined : parsed;
};

// https://stackoverflow.com/a/54646864
// `ArrayBufferView`, e.g. `Uint8Array`
const arrayBufferViewToArrayBuffer = (view: ArrayBufferView): ArrayBuffer => view.buffer.slice(view.byteOffset, view.byteLength + view.byteOffset);

type DownloadResult = Either<DownloadErrorCode, ArrayBuffer>;

const collectBodyReaderData = async(reader: ReadableStreamDefaultReader<Uint8Array>, maxFileSize: number): Promise<DownloadResult> => {
  let receivedLength = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    if (value === undefined) {
      break;
    }

    // If we want to show the progress in the future
    // console.log('Progress ${receivedLength} / ${contentLength}')
    receivedLength += value.length;

    if (receivedLength > maxFileSize) {
      return Left('filesize');
    }

    chunks.push(value);
  }

  const concatenatedAbView = new Uint8Array(receivedLength);
  let position = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const chunk of chunks) {
    concatenatedAbView.set(chunk, position);
    position += chunk.length;
  }

  return Right(arrayBufferViewToArrayBuffer(concatenatedAbView));
};

const readResponseToArrayBuffer = async(response: Response, maxFileSize: number): Promise<DownloadResult> => {
  if (response.body && typeof response.body.getReader === 'function') {
    return collectBodyReaderData(response.body.getReader(), maxFileSize);
  }

  // The `body` property isn't present in IE11, we have to fall back to a
  // simple `response.arrayBuffer()` call.
  return Right(await response.arrayBuffer());
};

export type DownloadErrorCode =
  // If the response was not in 200-299 range
  // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
  | 'status'
  // If the response took longer than `fileLoadingTimeout`
  | 'timeout'
  // Any other network errors, like CORS or no connection
  | 'network'
  // If the `content-length` header was bigger than `maxFileSize` or the body
  // response size has outgrown it.
  | 'filesize';

type ContinueResponse = {
  response: Response
  timeout: number
  controller: AbortController
  maxFileSize: number
};

/**
 * A special response type that has readable headers but no downloaded content
 * - can be passed into `continuePartialResponse` to download the content.
 */
export type PartialResponse = {
  mimeType: string | undefined
  _continue: ContinueResponse
};

export const downloadUrlToPartialResponse = async(
  url: string,
  maxFileSize: number
): Promise<Either<DownloadErrorCode, PartialResponse>> => {
  const controller = new AbortController();
  const timeout = self.setTimeout(() => {
    controller.abort();
  }, fileLoadingTimeout);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      return Left('status');
    }

    const mimeType = getMimeTypeFromHeaders(response.headers)?.toLowerCase();

    const contentLength = getContentLengthFromHeaders(response.headers);
    if (contentLength && contentLength > maxFileSize) {
      return Left('filesize');
    }

    if (response.body === null) {
      return Left('network');
    }

    return Right({
      mimeType,
      _continue: {
        response,
        timeout,
        controller,
        maxFileSize
      }
    });
  } catch (e) {
    console.error('download-error:', e);

    if (e?.name === 'AbortError') {
      return Left('timeout');
    }

    return Left('network');
  }
};

export const continuePartialResponse = async(partialResponse: PartialResponse): Promise<Either<DownloadErrorCode, ArrayBuffer>> => {
  const { timeout, response, maxFileSize } = partialResponse._continue;

  try {
    const ab = await readResponseToArrayBuffer(response, maxFileSize);

    clearTimeout(timeout);
    return ab;
  } catch (e) {
    console.error('download-error:', e);

    if (e?.name === 'AbortError') {
      return Left('timeout');
    }

    return Left('network');
  }
};
