const validateUserOptions = require("./lib/validateUserOptions");
const getExternalLinksFromPage = require("./lib/getExternalLinksFromPage");
const checkLinkStatuses = require("./lib/checkLinkStatuses");
const { isBroken, isRedirect, isOkay } = require("./lib/helpers");
const log = require("./lib/logger");

module.exports = function (eleventyConfig, _options) {
  const defaults = {
    broken: "warn",
    redirect: "warn",
    cacheDuration: "1d",
    loggingLevel: 2,
    excludeUrls: [],
    excludeInputs: [],
  };

  // validate user-supplied options
  validateUserOptions(_options);

  // merge default and user options, normalize
  const options = { ...defaults, ...(_options ?? {}) };
  options.loggingLevel = parseInt(options.loggingLevel);
  options.cacheDuration = options.cacheDuration.toLowerCase();
  options.broken = options.broken.toLowerCase();
  options.redirect = options.redirect.toLowerCase();

  // create store of links
  const store = [];

  // "Lint" each page and add links to store
  eleventyConfig.addLinter(
    "getExternalLinksFromPage",
    getExternalLinksFromPage(store, options, eleventyConfig)
  );

  eleventyConfig.on("eleventy.after", async () => {
    // check the link statuses
    await checkLinkStatuses(store, options.cacheDuration);

    // group links by status
    const brokenLinks = store.filter((item) => isBroken(item.getHttpStatusCode()));
    const redirectLinks = store.filter((item) => isRedirect(item.getHttpStatusCode()));
    const okayLinks = store.filter((item) => isOkay(item.getHttpStatusCode()));

    // log okay links
    options.loggingLevel === 3 &&
      okayLinks.forEach((link) => {
        log().okay().display(`Link okay:      ${link.url}`);
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

    // check to see if we need to throw an error
    if (options.broken === "error" && brokenLinks.length > 0)
      throw new Error("There are broken links in your build! See above for details.");
    if (options.redirect === "error" && redirectLinks.length > 0)
      throw new Error("There are redirect links in your build! See above for details.");
  });
};
