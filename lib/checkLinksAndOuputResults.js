const checkLinkStatuses = require("./checkLinkStatuses");
const outputResults = require("./outputResults");

function checkLinksAndOutputResults(store, options) {
  return async function () {
    // check the link statuses
    await checkLinkStatuses(store, options.cacheDuration);
    // output the results
    outputResults(store, options);
  };
}

module.exports = checkLinksAndOutputResults;
