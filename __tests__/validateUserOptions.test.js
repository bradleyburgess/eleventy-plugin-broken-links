const validateUserOptions = require("../lib/validateUserOptions");
const test = require("ava");

const testFunc = (opts) => () => validateUserOptions(opts);

test("forbidden", (t) => {
  t.notThrows(testFunc({ forbidden: "warn" }));
  t.notThrows(testFunc({ forbidden: "error" }));
  t.throws(testFunc({ forbidden: 1 }));
  t.throws(testFunc({ forbidden: "" }));
  t.throws(testFunc({ forbidden: [] }));
});

test("broken", (t) => {
  t.notThrows(testFunc({ broken: "warn" }));
  t.notThrows(testFunc({ broken: "error" }));
  t.throws(testFunc({ broken: 1 }));
  t.throws(testFunc({ broken: "" }));
  t.throws(testFunc({ broken: [] }));
});

test("redirect", (t) => {
  t.notThrows(testFunc({ redirect: "warn" }));
  t.notThrows(testFunc({ redirect: "error" }));
  t.throws(testFunc({ redirect: 1 }));
  t.throws(testFunc({ redirect: "" }));
  t.throws(testFunc({ redirect: [] }));
});

test("loggingLevel", (t) => {
  // accepted values
  t.notThrows(testFunc({ loggingLevel: 0 }));
  t.notThrows(testFunc({ loggingLevel: 1 }));
  t.notThrows(testFunc({ loggingLevel: 2 }));
  t.notThrows(testFunc({ loggingLevel: 3 }));
  // works with number string
  t.notThrows(testFunc({ loggingLevel: "1" }));
  // throws on another string or type
  t.throws(testFunc({ loggingLevel: "hello" }));
  t.throws(testFunc({ loggingLevel: [] }));
});

test("cacheDuration", (t) => {
  // valid inputs
  t.notThrows(testFunc({ cacheDuration: "1s" }));
  t.notThrows(testFunc({ cacheDuration: "1m" }));
  t.notThrows(testFunc({ cacheDuration: "1h" }));
  t.notThrows(testFunc({ cacheDuration: "1d" }));
  t.notThrows(testFunc({ cacheDuration: "1w" }));
  t.notThrows(testFunc({ cacheDuration: "1y" }));
  // invalid
  t.throws(testFunc({ cacheDuration: "0w" }));
  t.throws(testFunc({ cacheDuration: 1 }));
  t.throws(testFunc({ cacheDuration: [] }));
  t.throws(testFunc({ cacheDuration: {} }));
});

test("excludeUrls", (t) => {
  t.notThrows(testFunc({ excludeUrls: ["https://example.com"] }));
  t.notThrows(testFunc({ excludeUrls: ["example.com"] }));
  t.notThrows(testFunc({ excludeUrls: [] }));
  t.throws(testFunc({ excludeUrls: "https://example.com" }));
  t.throws(testFunc({ excludeUrls: ["https:/example.com"] }));
  t.throws(testFunc({ excludeUrls: {} }));
});

test("excludeInputs", (t) => {
  t.notThrows(testFunc({ excludeInputs: [] }));
  t.notThrows(testFunc({ excludeInputs: ["index.md"] }));
  t.throws(testFunc({ excludeInputs: "index.md" }));
  t.throws(testFunc({ excludeInputs: {} }));
  t.throws(testFunc({ excludeInputs: [1] }));
  t.throws(testFunc({ excludeInputs: ["index.md", 1] }));
});

test("callback", (t) => {
  t.throws(testFunc({ callback: "hello" }));
  t.throws(testFunc({ callback: 1 }));
  t.throws(testFunc({ callback: [] }));
  t.throws(testFunc({ callback: {} }));
});
