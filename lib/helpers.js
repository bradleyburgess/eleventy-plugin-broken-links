const mm = require("minimatch");

const isString = (input) => typeof input === "string";
const isNumber = (input) =>
  !isNaN(input) && (typeof input === "string" || typeof input === "number");

const isFunction = (input) => typeof input === "function";

const isNullOrUndefined = (input) => input === undefined || input === null;

// forbidden = status 403
const isForbidden = (code) => {
  const codeNumber = parseInt(code);
  return codeNumber == 403;
};

// broken = any status 400-504
const isBroken = (code) => {
  if (!isNumber(code)) return true;
  const codeNumber = parseInt(code);
  return codeNumber >= 400 && codeNumber <= 504 && codeNumber != 403;
};

// redirect is any 3xx status
const isRedirect = (code) => code >= 300 && code < 400;

// okay is not broken or redirect
const isOkay = (code) => !isForbidden(code) && !isBroken(code) && !isRedirect(code);

const isWarnOrError = (input) =>
  !isString(input) ? false : input.toLowerCase() === "warn" || input.toLowerCase() === "error";

const validCacheDurationRe = /^[1-9]+[0-9]?[smhdwy]$/;
const isValidCacheDuration = (duration) => validCacheDurationRe.test(duration);

const validUriRe =
  /^((http|https|ftp):\/\/)?([a-zA-Z0-9]+\.)*[a-zA-Z0-9_-]+\.[a-z]+(\/[a-zA-Z0-9-_]*)*\/?(\*|\?([a-zA-Z0-9-_&=])*)?$/;
const isValidUri = (uri) => validUriRe.test(uri);

// excludeUrls:
const shouldExcludeLink = (link, excludeUrls) => {
  let result = false;
  if (excludeUrls.includes(link)) result = true;
  excludeUrls.forEach((item) => {
    if (item.endsWith("*") && link.startsWith(item.slice(0, -1))) result = true;
  });
  return result;
};

// excludeInputs:
const removeDotSlash = (input) => (input.startsWith("./") ? input.slice(2) : input);
const removeEndSlash = (input) => (input.endsWith("/") ? input.slice(0, -1) : input);

const shouldExcludePage = (inputPath, dirInput, excludeInputs) => {
  // normalize paths; remove leading dot-slash and eleventy inputdir
  inputPath = removeDotSlash(inputPath);
  if (dirInput !== undefined) {
    dirInput = removeDotSlash(dirInput);
    dirInput = removeEndSlash(dirInput);
    inputPath = inputPath.slice(dirInput.length + 1);
  }
  excludeInputs = excludeInputs.map(removeDotSlash);

  return excludeInputs.some((glob) => mm(inputPath, glob));
};

module.exports = {
  isForbidden,
  isBroken,
  isOkay,
  isRedirect,
  isNumber,
  isNullOrUndefined,
  isString,
  isFunction,
  isValidCacheDuration,
  isValidUri,
  isWarnOrError,
  shouldExcludeLink,
  shouldExcludePage,
};
