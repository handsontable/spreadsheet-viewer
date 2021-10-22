import { Miniflare, Request } from 'miniflare';
import { readFileSync } from 'fs';
import assert from 'assert';
import fetch from 'node-fetch';

const script = readFileSync(new URL('../index.js', import.meta.url));
const mf = new Miniflare({ script });

const testProxyRoot = 'http://localhost:8787';
const testProxyPathname = '/corsproxy/';
const testProxyUrl = `${testProxyRoot}${testProxyPathname}`;

describe('CORS proxy', () => {
  describe('Incorrect request', () => {
    it('should return 404 for a request without correct pathname', async() => {
      const res = await mf.dispatchFetch(testProxyRoot);
      assert.equal(res.status, 404);
    });
    it('should return 404 for a request without target parameter', async() => {
      const res = await mf.dispatchFetch(testProxyUrl);
      assert.equal(res.status, 404);
    });
    it('should return 405 for a POST request', async() => {
      const res = await mf.dispatchFetch(
        new Request(testProxyUrl, { method: 'POST' })
      );
      assert.equal(res.status, 405);
    });
    it('should return 405 for a PUT request', async() => {
      const res = await mf.dispatchFetch(
        new Request(testProxyUrl, { method: 'PUT' })
      );
      assert.equal(res.status, 405);
    });
    it('should return 405 for a DELETE request', async() => {
      const res = await mf.dispatchFetch(
        new Request(testProxyUrl, { method: 'DELETE' })
      );
      assert.equal(res.status, 405);
    });
  });

  const fileUrl = 'https://handsontable.com/static/resources/ModSV/sample-file.xlsx';

  describe('Correct request', () => {
    it('should add CORS headers to the HEAD request', async() => {
      const directResponse = await fetch(fileUrl);
      const directHeaderKeys = Array.from(directResponse.headers.keys()).map(x => x.toLowerCase());
      assert.equal(directResponse.status, 200, 'Original status is 200');
      assert.equal(
        directHeaderKeys.includes('access-control-allow-origin'),
        false,
        'Original response does not have CORS headers'
      );

      const proxiedResponse = await mf.dispatchFetch(`${testProxyUrl}?target=${fileUrl}`);
      const proxiedHeaderKeys = Array.from(proxiedResponse.headers.keys()).map(x => x.toLowerCase());
      assert.equal(proxiedResponse.status, 200, 'Proxied status is 200');
      assert.equal(
        proxiedHeaderKeys.includes('access-control-allow-origin'),
        true,
        'Proxied response has CORS headers'
      );
    });

    it('should add CORS headers to the GET request', async() => {
      const directResponse = await fetch(fileUrl);
      const directHeaderKeys = Array.from(directResponse.headers.keys()).map(x => x.toLowerCase());
      assert.equal(directResponse.status, 200, 'Original status is 200');
      assert.equal(
        directHeaderKeys.includes('access-control-allow-origin'),
        false,
        'Original status does not have CORS headers'
      );

      const proxiedResponse = await mf.dispatchFetch(`${testProxyUrl}?target=${fileUrl}`);
      const proxiedHeaderKeys = Array.from(proxiedResponse.headers.keys()).map(x => x.toLowerCase());
      assert.equal(proxiedResponse.status, 200, 'Proxied status is 200');
      assert.equal(
        proxiedHeaderKeys.includes('access-control-allow-origin'),
        true,
        'Proxied status has CORS headers'
      );

      const directResponseBody = await directResponse.blob();
      const proxiedResponseBody = await proxiedResponse.blob();
      const contentLength = proxiedResponse.headers.get('content-length');
      assert.equal(proxiedResponseBody.size, contentLength, 'Proxied response have the size defined in the header');
      assert.equal(directResponseBody.toString('base64'), proxiedResponseBody.toString('base64'), 'Proxied response should have an equal body to the original response');
    });
  });
});
