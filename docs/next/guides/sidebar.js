const overviewItems = [
  "guides/overview/Licensing",
  "guides/overview/Features",
  "guides/overview/Known-limitations",
  "guides/overview/Open-source-licenses",
  "guides/overview/Supported-browsers",
  "guides/overview/Getting-in-touch",
];

const integrationItems = [
  "guides/integration/Quick-start",
  "guides/integration/Packages",
  "guides/integration/Frame-assets",
  "guides/integration/Security",
  "guides/integration/Error-codes",
];
const queryStringApiItems = [
  "guides/query-string-api/Query-String-API-Loading-a-workbook",
  "guides/query-string-api/Query-String-API-UI-configuration",
  "guides/query-string-api/Query-String-API-Experimental-feature-flags",
  "guides/query-string-api/Query-String-API-Reference",
];

const javaScriptApiItems = [
  "guides/javascript-api/JavaScript-API-Loading-a-workbook",
  "guides/javascript-api/JavaScript-API-UI-configuration",
  "guides/javascript-api/JavaScript-API-Selecting-a-cell",
  "guides/javascript-api/JavaScript-API-Experimental-feature-flags",
  "guides/javascript-api/JavaScript-API-Reference",
];

const webMessagingItems = [
  "guides/web-messaging-api/Communication-with-the-viewer",
  "guides/web-messaging-api/Web-Messaging-API-Communication-with-the-viewer",
  "guides/web-messaging-api/Web-Messaging-API-Reference"
];

const customizationItems = [
  "guides/customization/Customization",
  "guides/customization/Project-architecture",
  "guides/customization/Prerequisites",
  "guides/customization/Custom-build",
  "guides/customization/Testing",
  "guides/customization/Performance",
];

module.exports = {
  sidebar: [
    { title: "Overview", children: overviewItems },
    { title: "Integration", children: integrationItems },
    { title: "Query String API", children: queryStringApiItems },
    { title: "JavaScript API", children: javaScriptApiItems },
    { title: "Web Messaging API", children: webMessagingItems },
    { title: "Customization", children: customizationItems }
  ]
};
