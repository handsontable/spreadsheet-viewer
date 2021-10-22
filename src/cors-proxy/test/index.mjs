import { Miniflare, Request } from 'miniflare';
import { readFileSync } from 'fs';
import assert from 'assert';
import fetch from 'node-fetch';

const script = readFileSync(new URL('../index.js', import.meta.url));
const mf = new Miniflare({ script });

const testProxyRoot = 'http://localhost:8787';
const testProxyPathname = '/corsproxy/';
const testProxyUrl = `${testProxyRoot}${testProxyPathname}`;

const isCorsHeader = (headers) => {
  const proxiedHeaderKeys = Array.from(headers.keys()).map(x => x.toLowerCase());
  return proxiedHeaderKeys.includes('access-control-allow-origin');
};

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

  const existingFileUrl = 'https://handsontable.com/static/resources/ModSV/sample-file.xlsx';
  const existingHtmlUrl = 'https://handsontable.com/';
  const nonexistingFileUrl = 'https://www.google.com/404';

  describe('Correct HEAD request with a 200 response', () => {
    it('the direct response does not have CORS headers', async() => {
      const direct = await fetch(existingFileUrl, { method: 'HEAD' });
      assert.equal(direct.status, 200);
      assert.ok(!isCorsHeader(direct.headers));
    });

    it('should add CORS headers', async() => {
      const proxied = await mf.dispatchFetch(
        `${testProxyUrl}?target=${existingFileUrl}`,
        { method: 'HEAD' }
      );
      assert.equal(proxied.status, 200);
      assert.ok(isCorsHeader(proxied.headers));
    });

    it('should NOT add CORS headers if the filetype is not a workbook', async() => {
      const proxied = await mf.dispatchFetch(
        `${testProxyUrl}?target=${existingHtmlUrl}`,
        { method: 'HEAD' }
      );
      assert.equal(proxied.status, 415);
      assert.ok(!isCorsHeader(proxied.headers));
    });
  });

  describe('Correct HEAD request with a 404 response', () => {
    it('the direct response does not have CORS headers', async() => {
      const direct = await fetch(nonexistingFileUrl, { method: 'HEAD' });
      assert.equal(direct.status, 404);
      assert.ok(!isCorsHeader(direct.headers));
    });

    it('should NOT add CORS headers, should change the body', async() => {
      const proxied = await mf.dispatchFetch(
        `${testProxyUrl}?target=${nonexistingFileUrl}`,
        { method: 'HEAD' }
      );
      assert.equal(proxied.status, 415);
      assert.ok(!isCorsHeader(proxied.headers));
      const proxiedBody = await proxied.text();
      assert.equal(
        proxiedBody,
        'Proxy only works with workbook response types'
      );
    });
  });

  describe('Correct GET request with a 200 response', () => {
    it('the direct response does not have CORS headers', async() => {
      const direct = await fetch(existingFileUrl);
      assert.equal(direct.status, 200);
      assert.ok(!isCorsHeader(direct.headers));
    });

    it('should add CORS headers', async() => {
      const proxied = await mf.dispatchFetch(
        `${testProxyUrl}?target=${existingFileUrl}`
      );
      assert.equal(proxied.status, 200);
      assert.ok(isCorsHeader(proxied.headers));
    });

    it('should NOT add CORS headers if the filetype is not a workbook, should change the body', async() => {
      const proxied = await mf.dispatchFetch(
        `${testProxyUrl}?target=${existingHtmlUrl}`
      );
      assert.equal(proxied.status, 415);
      assert.ok(!isCorsHeader(proxied.headers));
      const proxiedBody = await proxied.text();
      assert.equal(
        proxiedBody,
        'Proxy only works with workbook response types'
      );
    });

    it('should not change the body of the GET response', async() => {
      const direct = await fetch(existingFileUrl);
      const proxied = await mf.dispatchFetch(
        `${testProxyUrl}?target=${existingFileUrl}`
      );
      const directBody = await direct.blob();
      const proxiedBody = await proxied.blob();
      const contentLength = proxied.headers.get('content-length');
      assert.equal(proxiedBody.size, contentLength);
      assert.equal(
        directBody.toString('base64'),
        proxiedBody.toString('base64'),
        'Proxied response should have an equal body to the original response'
      );
    });
  });

  describe('Correct GET request with a 404 response', () => {
    it('the direct response does not have CORS headers', async() => {
      const direct = await fetch(nonexistingFileUrl);
      assert.equal(direct.status, 404);
      assert.ok(!isCorsHeader(direct.headers));
    });

    it('should NOT add CORS headers, should change the body', async() => {
      const proxied = await mf.dispatchFetch(
        `${testProxyUrl}?target=${nonexistingFileUrl}`
      );
      assert.equal(proxied.status, 415);
      assert.ok(!isCorsHeader(proxied.headers));
      const proxiedBody = await proxied.text();
      assert.equal(
        proxiedBody,
        'Proxy only works with workbook response types'
      );
    });
  });
});
