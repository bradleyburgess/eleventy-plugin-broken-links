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

// validations
const isWarnOrError = (input) => input.toLowerCase() === "warn" || input.toLowerCase() === "error";

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
  isRedirect,
  isOkay,
  isWarnOrError,
  shouldExcludeLink,
};
