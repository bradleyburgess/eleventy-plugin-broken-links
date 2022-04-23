const chalk = require("chalk");
const store = require("./lib/store");
const getExternalLinksFromPage = require("./lib/getExternalLinksFromPage");
const checkLinkStatuses = require("./lib/checkLinkStatuses");
const { isBroken, isRedirect } = require("./lib/helpers");
const validateUserOptions = require("./lib/validateUserOptions");
const log = require("./lib/logger");

module.exports = function (eleventyConfig, _options) {
  const defaults = {
    broken: "warn",
    redirect: "warn",
    cacheDuration: "1d",
    loggingLevel: 2,
  };

  // validate user-supplied options
  validateUserOptions(_options);

  // merge default and user options
  const options = { ...defaults, ..._options };
  options.loggingLevel = parseInt(options.loggingLevel);

  // "Lint" each page and gather links
  eleventyConfig.addLinter("getExternalLinksFromPage", getExternalLinksFromPage);

  eleventyConfig.on("eleventy.after", async () => {
    await checkLinkStatuses(options.cacheDuration);
    const allLinks = Object.keys(store);
    const brokenLinks = allLinks.filter((link) => isBroken(store[link].getHttpStatusCode()));
    const redirectLinks = allLinks.filter((link) => isRedirect(store[link].getHttpStatusCode()));
    const okayLinks = allLinks.filter(
      (link) =>
        !isBroken(store[link].getHttpStatusCode()) && !isRedirect(store[link].getHttpStatusCode())
    );

    options.loggingLevel === 3 &&
      okayLinks.forEach((link) => {
        log().okay(`Link okay:      ${link}`);
      });

    options.loggingLevel >= 2 &&
      redirectLinks.forEach((link) => {
        const pages = store[link].getPages();
        log().warn(`Link redirects: ${link}`);
        log().display(`Used ${store[link].getLinkCount()} time(s) on these pages:`, 2);
        pages.forEach((page) => log().bullet().indent().display(page));
      });

    options.loggingLevel >= 1 &&
      brokenLinks.forEach((link) => {
        const pages = store[link].getPages();
        log().error().display(`Link is broken: ${link}`);
        log().display(`Used ${store[link].getLinkCount()} time(s) on these pages:`, 2);
        pages.forEach((page) => log().bullet().indent().display(page));
      });

    if (options.broken === "error" && brokenLinks.length > 0)
      throw new Error("There are broken links in your build! See above for details.");
    if (options.redirect === "error" && redirectLinks.length > 0)
      throw new Error("There are redirect links in your build! See above for details.");
  });
};

const nope = "no";
