// This file should serve as an emulation of a production environment that
// one would find on a live deployment of Spreadsheet Viewer, in addition to
// some simulated endpoints that we use for testing.

const fs = require('fs');
const http = require('http');
const path = require('path');

const connect = require('connect');
const serveStatic = require('serve-static');

const app = connect();

const log = (...s) => console.log('[serve-sv]', ...s);

app.use(serveStatic('dist/sv'));
app.use('/clientLibrary.js', serveStatic('dist/client-library/clientLibrary.js'));
app.use('/cypress/fixtures', serveStatic('cypress/fixtures'));

// Timeout simulation endpoint, will never return anything.
app.use('/simulate/timeout', () => {});

// Always 404.
app.use('/simulate/404', (req, res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end();
});

// Correct file, but invalid mime type.
app.use('/simulate/mime-wrong', (req, res) => {
  const p = path.join(__dirname, 'cypress/fixtures/empty.xlsx');
  const { size } = fs.statSync(p);
  res.writeHead(200, {
    'Content-Type': 'application/wrong-mime',
    'Content-Length': size
  });

  const readStream = fs.createReadStream(p);
  readStream.pipe(res);
});

// Correct file, but unsupported workbook mime type. (at the moment, `.ods`)
app.use('/simulate/mime-ods', (req, res) => {
  const p = path.join(__dirname, 'cypress/fixtures/empty.xlsx');
  const { size } = fs.statSync(p);
  res.writeHead(200, {
    'Content-Type': 'application/vnd.oasis.opendocument.spreadsheet',
    'Content-Length': size
  });

  const readStream = fs.createReadStream(p);
  readStream.pipe(res);
});

// Content-Length is over the file size limit.
// Note that at the time of writing, this test is useless and should be sending
// less than 10MB of the limit, which is pretty much the same case as
// /simulate/file-size/no-content-length. See the comment in
// `cypress/integration/ui/errors.spec.js` for info why.
app.use('/simulate/file-size/with-content-length', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Length': 11_000_000 // 11 MB, over the current limit
  });

  res.write(Buffer.alloc(11_000_000), 'binary');
  res.end(null, 'binary');
});

// Server sent an incorrect (or didn't send) the content length header, the app
// should drop the response as soon as it exceeds the file size limit.
app.use('/simulate/file-size/no-content-length', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  res.write(Buffer.alloc(11_000_000), 'binary');
  res.end(null, 'binary');
});

const host = '0.0.0.0';
const port = 5000;
http.createServer(app).listen(port, host, () => log('(app)', `Listening on ${host}:${port}`));

// CORS-disabled app on a different port, used to test network errors.
const corsApp = connect();
corsApp.use((req, res) => {
  const p = path.join(__dirname, 'cypress/fixtures/empty.xlsx');
  const { size } = fs.statSync(p);
  res.writeHead(200, {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Length': size
  });

  const readStream = fs.createReadStream(p);
  readStream.pipe(res);
});

http.createServer(corsApp).listen(port + 1, host, () => log('(cors-app)', `Listening on ${host}:${port + 1}`));
