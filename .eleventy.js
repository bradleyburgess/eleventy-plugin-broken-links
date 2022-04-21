const { parse } = require("node-html-parser");
const urlStatusCode = require("url-status-code");
const chalk = require("chalk");

const externalLinks = {};
const externalLinksWithStatus = {};

// broken = any status 400-504
const isBroken = (code) => code >= 400 && code <= 504;

// redirect is any 3xx status
const isRedirect = (code) => code >= 300 && code < 400;

const checkLink = (url) => {
  return new Promise((resolve, reject) => {
    urlStatusCode(url)
      .then((code) => {
        resolve({
          url,
          broken: isBroken(code),
          redirect: isRedirect(code),
        });
      })
      .catch((error) => {
        // return broken if address not found
        if (error.code === "ENOTFOUND")
          resolve({
            url,
            broken: true,
            redirect: false,
          });
      });
  });
};

function getExternalLinks(content) {
  const externalPageLinks = parse(content)
    .getElementsByTagName("a")
    .map((anchor) => anchor.getAttribute("href"))
    .filter((url) => url.startsWith("http"));
  externalLinks[this.inputPath] = externalPageLinks;
}

module.exports = function (eleventyConfig, _options) {
  const defaults = {
    broken: "warn",
    redirect: "warn",
  };

  // merge default and user options
  const options = { ...defaults, ..._options };

  // Lint each page and gather links
  eleventyConfig.addLinter("getExternalLinks", getExternalLinks);

  // After building, check the status of each link on each page
  eleventyConfig.on("eleventy.after", () => {
    // Go page by page
    Object.keys(externalLinks).forEach(async (page) => {
      externalLinksWithStatus[page] = await Promise.all(
        externalLinks[page].map((link) => checkLink(link))
      );
      // group redirect, broken, and okay links together
      const redirectLinks = externalLinksWithStatus[page].filter(
        (link) => link.redirect
      );
      const brokenLinks = externalLinksWithStatus[page].filter(
        (link) => link.broken
      );
      const okayLinks = externalLinksWithStatus[page].filter(
        (link) => !link.broken && !link.redirect
      );

      // output status of each link, grouped as above
      console.log(chalk.blue(`Links on ${page}:`));
      okayLinks.forEach((link) => {
        console.log(chalk.green(`    ${link.url} is okay`));
      });
      redirectLinks.forEach((link) => {
        console.log(chalk.yellow(`    ${link.url} is a redirect`));
      });
      brokenLinks.forEach((link) => {
        console.log(chalk.red.bold(`    ${link.url} is broken!`));
      });
      if (
        brokenLinks.length === 0 &&
        okayLinks.length === 0 &&
        redirectLinks.length === 0
      )
        console.log(chalk.yellow(`    no links found`));

      // check if we need to throw an error (based on options)
      if (brokenLinks.length > 0 && options.broken === "error")
        throw new Error(`Broken links found on page ${page}`);
      if (redirectLinks.length > 0 && options.redirect === "error")
        throw new Error(`Redirect links found on page ${page}`);
    });
  });
};
