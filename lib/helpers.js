// broken = any status 400-504
const isBroken = (code) => {
  if (isNaN(code)) return true;
  const codeNumber = parseInt(code);
  return codeNumber >= 400 && codeNumber <= 504;
};

// redirect is any 3xx status
const isRedirect = (code) => code >= 300 && code < 400;

// validations
const isWarnOrError = (input) => input.toLowerCase() === "warn" || input.toLowerCase() === "error";

module.exports = {
  isBroken,
  isRedirect,
  isWarnOrError,
};
