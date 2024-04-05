const debug = require("debug")("Eleventy:plugin-broken-links");
const { isForbidden, isBroken, isRedirect, isOkay } = require("./helpers");
const log = require("./logger");

function outputResults(store, options) {
  // group links by status
  const forbiddenLinks = store.filter((item) => isForbidden(item.getHttpStatusCode()));
  const brokenLinks = store.filter((item) => isBroken(item.getHttpStatusCode()));
  const redirectLinks = store.filter((item) => isRedirect(item.getHttpStatusCode()));
  const okayLinks = store.filter((item) => isOkay(item.getHttpStatusCode()));

  // log okay links
  options.loggingLevel === 3 &&
    okayLinks.forEach((link) => {
      log().okay().display(`Link okay:      ${link.url}`);
    });

  // log forbidden
  options.loggingLevel >= 2 &&
    forbiddenLinks.forEach((link) => {
      const pages = link.getPages();
      log().warn().display(`Link forbidden: ${link.url}`);
      log().display(`HTTP Status Code: ${link.getHttpStatusCode()}`);
      log().display(`Used ${link.getLinkCount()} time(s) on these pages:`, 2);
      pages.forEach((page) => log().bullet().indent().display(page));
    });

  // log redirects
  options.loggingLevel >= 2 &&
    redirectLinks.forEach((link) => {
      const pages = link.getPages();
      log().warn().display(`Link redirects: ${link.url}`);
      log().display(`HTTP Status Code: ${link.getHttpStatusCode()}`);
      log().display(`Used ${link.getLinkCount()} time(s) on these pages:`, 2);
      pages.forEach((page) => log().bullet().indent().display(page));
    });

  // log broken links
  options.loggingLevel >= 1 &&
    brokenLinks.forEach((link) => {
      const pages = link.getPages();
      log().error().display(`Link is broken: ${link.url}`);
      log().display(`HTTP Status Code: ${link.getHttpStatusCode()}`);
      log().display(`Used ${link.getLinkCount()} time(s) on these pages:`, 2);
      pages.forEach((page) => log().bullet().indent().display(page));
    });

  if (
    "callback" in options &&
    options.callback &&
    (brokenLinks.length > 0 || redirectLinks.length > 0)
  ) {
    debug("found callback; executing");
    options.callback(brokenLinks, redirectLinks);
  }

  if (forbiddenLinks.length > 0) debug(`found ${forbiddenLinks.length} broken links`);
  if (brokenLinks.length > 0) debug(`found ${brokenLinks.length} broken links`);
  if (redirectLinks.length > 0) debug(`found ${redirectLinks.length} redirect links`);

  // check to see if we need to throw an error
  if (options.broken === "error" && forbiddenLinks.length > 0)
    throw new Error("There are forbidden links in your build! See above for details.");
  if (options.broken === "error" && brokenLinks.length > 0)
    throw new Error("There are broken links in your build! See above for details.");
  if (options.redirect === "error" && redirectLinks.length > 0)
    throw new Error("There are redirect links in your build! See above for details.");
}

module.exports = outputResults;
