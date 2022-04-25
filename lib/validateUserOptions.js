const { isWarnOrError } = require("./helpers");
const { pre } = require("./logger");

function validateUserOptions(opts) {
  const error = (option, msg) => `${pre} Invalid option supplied for \`${option}\`; ${msg}`;

  if ("broken" in opts) {
    if (!isWarnOrError(opts.broken)) throw new Error(error("broken", "must be `warn` or `error`"));
  }
  if ("redirect" in opts) {
    if (!isWarnOrError(opts.redirect))
      throw new Error(error("redirect", "must be `warn` or `error`"));
  }

  if ("cacheDuration" in opts) {
    const re = /^[1-9]+[0-9]?[smhdwy]$/;
    if (!re.test(opts.cacheDuration))
      throw new Error(
        error(
          "cacheDuration",
          "for valid options, see https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration"
        )
      );
  }

  if ("loggingLevel" in opts) {
    if (isNaN(opts.loggingLevel) || opts.loggingLevel < 0 || opts.loggingLevel > 3)
      throw new Error(error("loggingLevel", "must be 0-3."));
  }
}

module.exports = validateUserOptions;
