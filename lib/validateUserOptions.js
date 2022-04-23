const { pre } = require("./helpers");

function validateUserOptions(userOptions) {
  const error = (option, msg) => `${pre} Invalid option supplied for \`${option}\`; ${msg}`;

  if (userOptions?.broken) {
    if (userOptions?.broken !== "warn" || userOptions?.broken !== "error")
      throw new Error(error("broken", "must be `warn` or `error`"));
  }
  if (userOptions?.redirect) {
    if (userOptions.redirect !== "warn" || userOptions.redirect !== "error")
      throw new Error(error("redirect", "must be `warn` or `error`"));
  }

  if (userOptions?.cacheDuration) {
    const re = /^[1-9]+[0-9]?[smhdwy]$/;
    if (!re.test(userOptions.cacheDuration))
      throw new Error(error("cacheDuration", "see `eleventy-fetch` docs for valid options."));
  }

  if (userOptions?.loggingLevel) {
    if (
      typeof parseInt(userOptions.loggingLevel) !== "number" ||
      userOptions.loggingLevel < 0 ||
      userOptions.loggingLevel > 3
    )
      throw new Error(error("loggingLevel", "must be 0-3."));
  }
}

module.exports = validateUserOptions;
