const debug = require("debug")("Eleventy:plugin-broken-links");
const getLinkStatusCode = require("./getLinkStatusCode");

async function checkLinkStatuses(store, cacheDuration) {
  debug("checking link statuses...");
  const results = await Promise.all(
    store.map((item) => getLinkStatusCode(item.url, cacheDuration))
  );
  results.forEach(({ url, httpStatusCode }) => {
    store.find((item) => item.url === url).setHttpStatusCode(httpStatusCode);
  });
  debug("done checking link statuses");
}

module.exports = checkLinkStatuses;
