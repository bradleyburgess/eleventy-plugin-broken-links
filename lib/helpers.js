const chalk = require("chalk");

// broken = any status 400-504
const isBroken = (code) => {
  if (code === "ENOTFOUND") return true;
  const codeNumber = parseInt(code);
  return codeNumber >= 400 && codeNumber <= 504;
};

// redirect is any 3xx status
const isRedirect = (code) => code >= 300 && code < 400;

const indent = (text, level = 4) => Array(level + 1).join(" ") + text;
const bullet = (text) => "- " + text;

const log = {
  warn(text) {
    console.log(chalk.yellow(text));
  },
  error(text) {
    console.log(chalk.bold.red(text));
  },
  okay(text) {
    console.log(chalk.green(text));
  },
  normal(text) {
    console.log(text);
  },
};

module.exports = {
  bullet,
  indent,
  isBroken,
  isRedirect,
  log,
};
