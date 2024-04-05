const { defaults } = require("./lib/constants");
const validateUserOptions = require("./lib/validateUserOptions");
const getExternalLinksFromPage = require("./lib/getExternalLinksFromPage");
const checkLinksAndOutputResults = require("./lib/checkLinksAndOuputResults");

module.exports = function (eleventyConfig, _options) {
  // validate user-supplied options
  validateUserOptions(_options);

  // merge default and user options, normalize
  const options = { ...defaults, ...(_options ?? {}) };
  options.loggingLevel = parseInt(options.loggingLevel);
  options.cacheDuration = options.cacheDuration.toLowerCase();
  options.forbidden = options.forbidden.toLowerCase();
  options.broken = options.broken.toLowerCase();
  options.redirect = options.redirect.toLowerCase();

  // create store of links
  const store = [];

  // Phase 1: "Lint" each page and add links to store
  eleventyConfig.addLinter(
    "getExternalLinksFromPage",
    getExternalLinksFromPage(store, options, eleventyConfig)
  );

  // Phase 2: Check the links and log them
  eleventyConfig.on("eleventy.after", checkLinksAndOutputResults(store, options));
};
