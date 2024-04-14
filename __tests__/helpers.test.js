const {
  isForbidden,
  isBroken,
  isNumber,
  isFunction,
  isNullOrUndefined,
  isString,
  isOkay,
  isRedirect,
  isValidCacheDuration,
  isValidUri,
  isWarnOrError,
  shouldExcludeLink,
  shouldExcludePage,
} = require("../lib/helpers");

describe("helpers", () => {
  test("isNumber", () => {
    expect(isNumber(1)).toBe(true);
    expect(isNumber("1")).toBe(true);
    expect(isNumber([])).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber("hello")).toBe(false);
  });

  test("isString", () => {
    expect(isString("hello")).toBe(true);
    expect(isString(1)).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString({})).toBe(false);
  });

  test("isFunction", () => {
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction("hello")).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
  });

  test("isNullOrUndefined", () => {
    const obj = { key: "value" };
    expect(isNullOrUndefined(null)).toBe(true);
    expect(isNullOrUndefined(undefined)).toBe(true);
    expect(isNullOrUndefined(obj.hello)).toBe(true);
    expect(isNullOrUndefined(obj.key)).toBe(false);
  });

  test("isForbidden", () => {
    const codes = [403];
    codes.forEach((code) => {
      expect(isForbidden(code)).toBe(true);
    });
    expect(isForbidden(200)).toBe(false);
  });

  test("isBroken", () => {
    const codes = [400, 404, "ENOTFOUND"];
    codes.forEach((code) => {
      expect(isBroken(code)).toBe(true);
    });
    expect(isBroken(200)).toBe(false);
  });

  test("isRedirect", () => {
    const codes = [300, 301, 302, 303, 307, 308, 399];
    codes.forEach((code) => {
      expect(isRedirect(code)).toBe(true);
    });
    expect(isRedirect(404)).toBe(false);
  });

  test("isOkay", () => {
    expect(isOkay(200)).toBe(true);
    expect(isOkay(404)).toBe(false);
  });

  test("isValidCacheDuration", () => {
    const shouldFail = ["1", "d", ""];
    const shouldPass = ["1d", "2w", "3y", "40h"];

    shouldFail.forEach((i) => {
      expect(isValidCacheDuration(i)).toBe(false);
    });
    shouldPass.forEach((i) => {
      expect(isValidCacheDuration(i)).toBe(true);
    });
  });

  test("isValidUri", () => {
    const shouldPass = [
      "https://example.com",
      "http://www.google.com",
      "https://www.example.com/about/234blog",
    ];
    const shouldFail = [[], "&23.google.com", "h33://google.com", "http:/google.com"];

    shouldPass.forEach((i) => {
      expect(isValidUri(i)).toBe(true);
    });
    shouldFail.forEach((i) => {
      expect(isValidUri(i)).toBe(false);
    });
  });

  test("isWarnOrError", () => {
    expect(isWarnOrError("warn")).toBe(true);
    expect(isWarnOrError("error")).toBe(true);
    expect(isWarnOrError("sdf")).toBe(false);
    expect(isWarnOrError([])).toBe(false);
  });

  test("shouldExcludeLink", () => {
    const excludeUrls = ["https://example.com", "https://google.com*", "https://test.com/*"];

    const testFunc = (url) => shouldExcludeLink(url, excludeUrls);

    expect(testFunc("https://example.com")).toBe(true);
    expect(testFunc("https://google.com")).toBe(true);
    expect(testFunc("https://google.com/about")).toBe(true);
    expect(testFunc("https://test.com/about")).toBe(true);

    expect(testFunc("https://test.com")).toBe(false);
    expect(testFunc("https://example.com/about")).toBe(false);
    expect(testFunc("https://www.example.com")).toBe(false);
  });

  test("shouldExcludePage", () => {
    const excludeInputs = ["index.md", "**/about.md", "notes/**"];

    const testFunc1 = (page) => shouldExcludePage(page, undefined, excludeInputs);
    expect(testFunc1("index.md")).toBe(true);
    expect(testFunc1("./index.md")).toBe(true);
    expect(testFunc1("info/about.md")).toBe(true);
    expect(testFunc1("./info/about.md")).toBe(true);
    expect(testFunc1("stuff/more/about.md")).toBe(true);
    expect(testFunc1("notes/index.md")).toBe(true);
    expect(testFunc1("./notes/index.md")).toBe(true);
    expect(testFunc1("about/index.md")).toBe(false);
    expect(testFunc1("about/notes/index.md")).toBe(false);

    const testFunc2 = (page) => shouldExcludePage(page, "./src", excludeInputs);
    expect(testFunc2("./src/index.md")).toBe(true);
    expect(testFunc2("src/notes/index.md")).toBe(true);
    expect(testFunc2("src/info/about.md")).toBe(true);
    expect(testFunc2("index.md")).toBe(false);
  });
});
