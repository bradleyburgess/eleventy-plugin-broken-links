const test = require("ninos")(require("ava"));
const log = require("../lib/logger");
const { pre } = require("../lib/logger");
const chalk = require("chalk");

test("console.log is called", (t) => {
  const s = t.context.spy(console, "log", () => {});
  log().display("testing 123");
  t.is(s.calls.length, 1);
});

test("console.log has correct text", (t) => {
  const s = t.context.spy(console, "log", () => {});
  log().display("testing 123");
  t.true(s.calls[0].arguments[0].includes("testing 123"));
  t.is(s.calls[0].arguments[0], chalk.white(pre + " testing 123"));
});

test("warn has correct color", (t) => {
  const s = t.context.spy(console, "log", () => {});
  log().warn().display("testing 123");
  t.is(s.calls[0].arguments[0], chalk.yellow(pre + " testing 123"));
});

test("indent", (t) => {
  const s = t.context.spy(console, "log", () => {});
  log().indent().display("testing 123");
  t.is(s.calls[0].arguments[0], chalk.white(pre + "   testing 123"));
});

test("bullet", (t) => {
  const s = t.context.spy(console, "log", () => {});
  log().bullet().display("testing 123");
  t.is(s.calls[0].arguments[0], chalk.white(pre + " - testing 123"));
});
