const validateUserOptions = require("../lib/validateUserOptions");

describe("validateUserOptions", () => {
  const testFunc = (opts) => () => validateUserOptions(opts);

  test("forbidden", () => {
    expect(testFunc({ forbidden: "warn" })).not.toThrow();
    expect(testFunc({ forbidden: "error" })).not.toThrow();
    expect(testFunc({ forbidden: 1 })).toThrow();
    expect(testFunc({ forbidden: "" })).toThrow();
    expect(testFunc({ forbidden: [] })).toThrow();
  });

  test("broken", () => {
    expect(testFunc({ broken: "warn" })).not.toThrow();
    expect(testFunc({ broken: "error" })).not.toThrow();
    expect(testFunc({ broken: 1 })).toThrow();
    expect(testFunc({ broken: "" })).toThrow();
    expect(testFunc({ broken: [] })).toThrow();
  });

  test("redirect", () => {
    expect(testFunc({ redirect: "warn" })).not.toThrow();
    expect(testFunc({ redirect: "error" })).not.toThrow();
    expect(testFunc({ redirect: 1 })).toThrow();
    expect(testFunc({ redirect: "" })).toThrow();
    expect(testFunc({ redirect: [] })).toThrow();
  });

  test("loggingLevel", () => {
    expect(testFunc({ loggingLevel: 0 })).not.toThrow();
    expect(testFunc({ loggingLevel: 1 })).not.toThrow();
    expect(testFunc({ loggingLevel: 2 })).not.toThrow();
    expect(testFunc({ loggingLevel: 3 })).not.toThrow();
    expect(testFunc({ loggingLevel: "1" })).not.toThrow();
    expect(testFunc({ loggingLevel: "hello" })).toThrow();
    expect(testFunc({ loggingLevel: [] })).toThrow();
  });

  test("cacheDuration", () => {
    expect(testFunc({ cacheDuration: "1s" })).not.toThrow();
    expect(testFunc({ cacheDuration: "1m" })).not.toThrow();
    expect(testFunc({ cacheDuration: "1h" })).not.toThrow();
    expect(testFunc({ cacheDuration: "1d" })).not.toThrow();
    expect(testFunc({ cacheDuration: "1w" })).not.toThrow();
    expect(testFunc({ cacheDuration: "1y" })).not.toThrow();
    expect(testFunc({ cacheDuration: "0w" })).toThrow();
    expect(testFunc({ cacheDuration: 1 })).toThrow();
    expect(testFunc({ cacheDuration: [] })).toThrow();
    expect(testFunc({ cacheDuration: {} })).toThrow();
  });

  test("excludeUrls", () => {
    expect(testFunc({ excludeUrls: ["https://example.com"] })).not.toThrow();
    expect(testFunc({ excludeUrls: ["example.com"] })).not.toThrow();
    expect(testFunc({ excludeUrls: [] })).not.toThrow();
    expect(testFunc({ excludeUrls: "https://example.com" })).toThrow();
    expect(testFunc({ excludeUrls: ["https:/example.com"] })).toThrow();
    expect(testFunc({ excludeUrls: {} })).toThrow();
  });

  test("excludeInputs", () => {
    expect(testFunc({ excludeInputs: [] })).not.toThrow();
    expect(testFunc({ excludeInputs: ["index.md"] })).not.toThrow();
    expect(testFunc({ excludeInputs: "index.md" })).toThrow();
    expect(testFunc({ excludeInputs: {} })).toThrow();
    expect(testFunc({ excludeInputs: [1] })).toThrow();
    expect(testFunc({ excludeInputs: ["index.md", 1] })).toThrow();
  });

  test("callback", () => {
    expect(testFunc({ callback: "hello" })).toThrow();
    expect(testFunc({ callback: 1 })).toThrow();
    expect(testFunc({ callback: [] })).toThrow();
    expect(testFunc({ callback: {} })).toThrow();
  });
});
