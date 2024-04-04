const chalk = require("kleur");

const pre = "[plugin-broken-links]";

class Message {
  constructor() {
    this.pre = pre;
    this.text = "";
    this.write = chalk.white;
  }

  indent(level = 2) {
    this.text = Array(level + 1).join(" ") + this.text;
    return this;
  }

  bullet(sym = "-") {
    this.text = sym + " " + this.text;
    return this;
  }

  okay() {
    this.write = chalk.green;
    return this;
  }

  forbidden() {
    this.write = chalk.yellow;
    return this;
  }

  warn() {
    this.write = chalk.yellow;
    return this;
  }

  error() {
    this.write = chalk.red().underline().bold;
    return this;
  }

  display(text) {
    this.text = this.text + text;
    console.log(this.write(`${this.pre} ${this.text}`));
  }
}

function log() {
  return new Message();
}

module.exports = log;
exports = module.exports;
exports.pre = pre;
