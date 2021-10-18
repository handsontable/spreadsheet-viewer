import { Miniflare, Request } from 'miniflare';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const script = readFileSync(`${__dirname}/../index.js`);
const mf = new Miniflare({ script });

const testProxyRoot = 'http://localhost:8787/';
const testProxyUrl = 'http://localhost:8787/corsproxy/';

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
        new Request(testProxyUrl, {
          method: 'POST',
        })
      );
      assert.equal(res.status, 405);
    });
  });
  describe('Correct request', () => {
    it('should add CORS headers', async() => {
      const fileUrl = 'https://handsontable.com/static/resources/ModSV/sample-file.xlsx';
      const origRes = await fetch(fileUrl);
      const origHeaderKeys = Array.from(origRes.headers.keys()).map(x => x.toLowerCase());
      assert.equal(origRes.status, 200, 'Original status is 200');
      assert.equal(origHeaderKeys.includes('access-control-allow-origin'), false, 'Original status does not have CORS headers');

      const res = await mf.dispatchFetch(
        `${testProxyUrl}?target=${fileUrl}`
      );
      const headerKeys = Array.from(res.headers.keys()).map(x => x.toLowerCase());
      assert.equal(res.status, 200, 'Proxied status is 200');
      assert.equal(headerKeys.includes('access-control-allow-origin'), true, 'Proxied status has CORS headers');
    });
  });
});
