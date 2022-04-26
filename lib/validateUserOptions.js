const { isWarnOrError, isValidCacheDuration, isValidUri } = require("./helpers");
const { pre } = require("./logger");

function validateUserOptions(opts) {
  const error = (option, msg) => `${pre} Invalid option supplied for \`${option}\`; ${msg}`;

  if (!opts) return;

  if ("broken" in opts) {
    if (!isWarnOrError(opts.broken)) throw new Error(error("broken", "must be `warn` or `error`"));
  }
  if ("redirect" in opts) {
    if (!isWarnOrError(opts.redirect))
      throw new Error(error("redirect", "must be `warn` or `error`"));
  }

  if ("cacheDuration" in opts) {
    if (!isValidCacheDuration(opts.cacheDuration))
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

  if ("excludeUrls" in opts) {
    if (!Array.isArray(opts.excludeUrls)) throw new Error(error("excludeUrls", "must be an array"));
    if (!opts.excludeUrls.every((item) => isValidUri(item)))
      throw new Error(error("excludeUrls", "must all be valid URIs"));
  }

  if ("excludeInputs" in opts) {
    if (!Array.isArray(opts.excludeInputs))
      throw new Error(error("excludeInputs", "must be an array"));
    if (!opts.excludeInputs.every((item) => typeof item === "string"))
      throw new Error(error("excludeInputs", "must all be strings"));
  }
}

module.exports = validateUserOptions;
