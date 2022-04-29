const test = require("ava");
const {
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

test("isNumber", (t) => {
  t.true(isNumber(1));
  t.true(isNumber("1"));
  t.false(isNumber([]));
  t.false(isNumber({}));
  t.false(isNumber("hello"));
});

test("isString", (t) => {
  t.true(isString("hello"));
  t.false(isString(1));
  t.false(isString([]));
  t.false(isString({}));
});

test("isFunction", (t) => {
  t.true(isFunction(function () {}));
  t.false(isFunction("hello"));
  t.false(isFunction({}));
  t.false(isFunction([]));
});

test("isNullOrUndefined", (t) => {
  const obj = { key: "value" };
  t.true(isNullOrUndefined(null));
  t.true(isNullOrUndefined(undefined));
  t.true(isNullOrUndefined(obj.hello));
  t.false(isNullOrUndefined(obj.key));
});

test("isBroken", (t) => {
  const codes = [400, 404, "ENOTFOUND"];
  codes.forEach((code) => {
    t.true(isBroken(code));
  });

  t.false(isBroken(200));
});

test("isRedirect", (t) => {
  const codes = [300, 301, 399];
  codes.forEach((code) => t.true(isRedirect(code)));

  t.false(isRedirect(404));
});

test("isOkay", (t) => {
  t.true(isOkay(200));
  t.false(isOkay(404));
});

test("isValidCacheDuration", (t) => {
  const shouldFail = ["1", "d", ""];
  const shouldPass = ["1d", "2w", "3y", "40h"];

  shouldFail.forEach((i) => t.false(isValidCacheDuration(i)));
  shouldPass.forEach((i) => t.true(isValidCacheDuration(i)));
});

test("isValidUri", (t) => {
  const shouldPass = [
    "https://example.com",
    "http://www.google.com",
    "https://www.example.com/about/234blog",
  ];
  const shouldFail = [[], "&23.google.com", "h33://google.com", "http:/google.com"];

  shouldPass.forEach((i) => t.true(isValidUri(i)));
  shouldFail.forEach((i) => t.false(isValidUri(i)));
});

test("isWarnOrError", (t) => {
  t.true(isWarnOrError("warn"));
  t.true(isWarnOrError("error"));
  t.false(isWarnOrError("sdf"));
  t.false(isWarnOrError([]));
});

test("shouldExcludeLink", (t) => {
  const excludeUrls = ["https://example.com", "https://google.com*", "https://test.com/*"];

  const testFunc = (url) => shouldExcludeLink(url, excludeUrls);

  t.true(testFunc("https://example.com"));
  t.true(testFunc("https://google.com"));
  t.true(testFunc("https://google.com/about"));
  t.true(testFunc("https://test.com/about"));

  t.false(testFunc("https://test.com"));
  t.false(testFunc("https://example.com/about"));
  t.false(testFunc("https://www.example.com"));
});

test("shouldExcludePage", (t) => {
  const excludeInputs = ["index.md", "**/about.md", "notes/**"];

  const testFunc1 = (page) => shouldExcludePage(page, undefined, excludeInputs);
  t.true(testFunc1("index.md"));
  t.true(testFunc1("./index.md"));
  t.true(testFunc1("info/about.md"));
  t.true(testFunc1("./info/about.md"));
  t.true(testFunc1("stuff/more/about.md"));
  t.true(testFunc1("notes/index.md"));
  t.true(testFunc1("./notes/index.md"));
  t.false(testFunc1("about/index.md"));
  t.false(testFunc1("about/notes/index.md"));

  const testFunc2 = (page) => shouldExcludePage(page, "./src", excludeInputs);
  t.true(testFunc2("./src/index.md"));
  t.true(testFunc2("src/notes/index.md"));
  t.true(testFunc2("src/info/about.md"));
  t.false(testFunc2("index.md"));
});
