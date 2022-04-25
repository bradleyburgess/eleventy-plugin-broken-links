const getLinkStatusCode = require("./getLinkStatusCode");

async function checkLinkStatuses(store, cacheDuration) {
  const results = await Promise.all(
    store.map((item) => getLinkStatusCode(item.url, cacheDuration))
  );
  results.forEach(({ url, httpStatusCode }) => {
    store.find((item) => item.url === url).setHttpStatusCode(httpStatusCode);
  });
}

module.exports = checkLinkStatuses;
