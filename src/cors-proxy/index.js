// based on https://developers.cloudflare.com/workers/examples/cors-header-proxy

// The endpoint you want the CORS reverse proxy to be on
const PROXY_ENDPOINT = '/corsproxy/';

// keep in sync with src/sv/filetype.ts
const workbookMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  'application/vnd.ms-excel.sheet.macroenabled.12',
  'application/vnd.ms-excel.template.macroenabled.12',
  'application/vnd.ms-excel.addin.macroenabled.12',
  'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/x-iwork-numbers-sffnumbers',
  'application/vnd.apple.numbers',
];

// Some HTTP servers include additional information after semicolon, e.g.
// 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;
// charset=utf-8'
const getMimeTypeFromHeaders = headers => headers.get('content-type')?.split(';')[0] || undefined;

async function handleRequest(request) {
  const url = new URL(request.url);
  const target = url.searchParams.get('target');

  if (!target) {
    return new Response('Proxy failed to find the required query parameter in the request', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  // Rewrite request to point to API url. This also makes the request mutable
  // so we can add the correct Origin header to make the API server think
  // that this request isn't cross-site.
  request = new Request(target, request);
  request.headers.set('Origin', new URL(target).origin);
  let response = await fetch(request);

  // Recreate the response so we can modify the headers
  // According to the note on https://developers.cloudflare.com/workers/learning/using-streams, response.body
  // is already a readable stream
  response = new Response(response.body, response);

  const mimeType = getMimeTypeFromHeaders(response.headers)?.toLowerCase();
  if (workbookMimeTypes.includes(mimeType)) {
    // Set CORS headers for workbook files
    // response.headers.set("Access-Control-Allow-Origin", url.origin)
    response.headers.set('Access-Control-Allow-Origin', '*');

    // Append to/Add Vary header so browser will cache response correctly
    response.headers.append('Vary', 'Origin');

    return response;
  }

  return new Response('Proxy only works with workbook response types', {
    status: 415,
    statusText: 'Unsupported Media Type',
  });
}

function handleOptions(request) {
  const { headers } = request;
  if (
    headers.get('Origin') !== null
    && headers.get('Access-Control-Request-Method') !== null
    && headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    const respHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
    };

    return new Response(null, {
      headers: respHeaders,
    });
  }

  // Handle standard OPTIONS request.
  // If you want to allow other HTTP Methods, you can do that here.
  return new Response(null, {
    headers: {
      Allow: 'GET, HEAD, OPTIONS',
    },
  });

}

addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.pathname.startsWith(PROXY_ENDPOINT)) {
    if (request.method === 'OPTIONS') {
      // Handle CORS preflight requests
      event.respondWith(handleOptions(request));
    } else if (
      request.method === 'GET'
      || request.method === 'HEAD'
    ) {
      event.respondWith(handleRequest(request));
    } else {
      event.respondWith(
        new Response('Proxy does not allow methods other than GET, HEAD, OPTIONS', {
          status: 405,
          statusText: 'Method Not Allowed',
        }),
      );
    }
  } else {
    event.respondWith(
      new Response('Proxy failed to find the required pathname in the request', {
        status: 404,
        statusText: 'Not Found',
      }),
    );
  }
});
