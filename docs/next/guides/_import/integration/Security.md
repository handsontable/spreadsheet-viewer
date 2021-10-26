As explained on the other pages, Spreadsheet Viewer consists of two main components:

1. The main app, `sv`, ran inside of an `<iframe>`
2. The `client-library` module that implements the [[JavaScript API|JavaScript API Reference]]

This means that installing Spreadsheet Viewer on your site securely is relatively straight forward, and we took security precautions in order to not expose your or your users' data.


## Content Security Policy (CSP)

If you use the [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) on your site, the only required rule that you might need to add for Spreadsheet Viewer to run is `frame-src`, pointing towards the origin (domain) where you placed your Spreadsheet Viewer assets.

For example, if:
- Your host site is on the origin `example.com`
- Spreadsheet Viewer assets are on the origin `sv.example.com`
- Your CSP rules start with `default-src: self;`

You must add `frame-src: 'self' sv.example.com` to your rules.

On the other hand, if your Spreadsheet Viewer assets are on the same origin as your main site, SV will work just fine with just `default-src: self;` as the CSP rules.

The above rules allow for downloading workbooks from other domain as well, as long as they expose a proper CORS header (see the next section).

**Note** that due to a [certain Firefox bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1365502), when the `frame-src` policy is enabled, Firefox blocks downloading workbooks from origins other than the ones specified in the mentioned policy. For example, if we want to download a workbook loaded from `app.com`, the host page needs to either be on the origin `app.com` or `app.com` must be included in the `frame-src` policy.

In other words, the minimum rules required to include Spreadsheet Viewer on your page are:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self';">
```

And if your `assetsUrl` configuration points to an origin different than your host page:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; frame-src 'self' <assets-url-origin>;">
```
(e.g. if you specify `assetsUrl` to be `static.my-app.com/assets/spreadsheet-viewer/index.html`, replace `<assets-url-origin>` above with `static.my-app.com`).

If you're pulling the [[JavaScript API|JavaScript API Reference]] module from an origin other than the host page or you're using it inline in a `<script>` tag, you will also need to add the `script-src` directive to your CSP rules: `script-src <sv-javascript-api-origin>`. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) for more info.

## Cross-Origin Resource Sharing (CORS)

Spreadsheet Viewer supports loading workbooks from URL's, both from the same origin and from foreign origins. If you want to load workbooks from origins other than the one your page is hosted on, ensure that a proper CORS header is included in the response of the foreign origin's server.

For example, if:
- Your host site is on the origin `https://example.com`
- You want to load a workbook from `https://workbooks.example.com/data.xlsx`

The response from `workbooks.example.com` must include at least:

```
Access-Control-Allow-Origin: https://example.com
```

Alternatively, to allow all origins to download the workbook, you can use a `*` but it generally should be avoided if possible.
