// broken = any status 400-504
const isBroken = (code) => {
  if (isNaN(code)) return true;
  const codeNumber = parseInt(code);
  return codeNumber >= 400 && codeNumber <= 504;
};

// redirect is any 3xx status
const isRedirect = (code) => code >= 300 && code < 400;

// okay is not broken or redirect
const isOkay = (code) => !isBroken(code) && !isRedirect(code);

const isWarnOrError = (input) => input.toLowerCase() === "warn" || input.toLowerCase() === "error";

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

module.exports = {
  isBroken,
  isOkay,
  isRedirect,
  isValidCacheDuration,
  isValidUri,
  isWarnOrError,
  shouldExcludeLink,
};
