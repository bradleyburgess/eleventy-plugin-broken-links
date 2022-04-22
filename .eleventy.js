const chalk = require("chalk");
const store = require("./lib/store");
const getExternalLinksFromPage = require("./lib/getExternalLinksFromPage");
const checkLinkStatuses = require("./lib/checkLinkStatuses");
const { log, isBroken, isRedirect, indent, bullet } = require("./lib/helpers");

module.exports = function (eleventyConfig, _options) {
  const defaults = {
    broken: "warn",
    redirect: "warn",
    cacheDuration: "1d",
  };

  // merge default and user options
  const options = { ...defaults, ..._options };

  // "Lint" each page and gather links
  eleventyConfig.addLinter(
    "getExternalLinksFromPage",
    getExternalLinksFromPage
  );

  eleventyConfig.on("eleventy.after", async () => {
    await checkLinkStatuses();
    const allLinks = Object.keys(store);
    const brokenLinks = allLinks.filter((link) =>
      isBroken(store[link].getHttpStatusCode())
    );
    const redirectLinks = allLinks.filter((link) =>
      isRedirect(store[link].getHttpStatusCode())
    );
    const okayLinks = allLinks.filter(
      (link) =>
        !isBroken(store[link].getHttpStatusCode()) &&
        !isRedirect(store[link].getHttpStatusCode())
    );

    okayLinks.forEach((link) => {
      console.log(chalk.green(`Link okay:      ${link}`));
    });

    redirectLinks.forEach((link) => {
      const pages = store[link].getPages();
      log.warn(`Link redirects: ${link}`);
      log.normal(indent("Used on these pages:", 2));
      pages.forEach((page) => log.normal(indent(bullet(page))));
    });

    brokenLinks.forEach((link) => {
      const pages = store[link].getPages();
      log.error(`Link is broken: ${link}`);
      log.normal(indent("Used on these pages:", 2));
      pages.forEach((page) => log.normal(indent(bullet(page))));
    });

    if (options.broken === "error" && brokenLinks.length > 0)
      throw new Error(
        "There are broken links in your build! See above for details."
      );
    if (options.redirect === "error" && redirectLinks.length > 0)
      throw new Error(
        "There are redirect links in your build! See above for details."
      );
  });
};

const nope = "no"