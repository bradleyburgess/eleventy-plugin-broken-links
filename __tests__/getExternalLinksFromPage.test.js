const test = require("ava");
const { defaults } = require("../lib/constants");
const ExternalLink = require("../lib/ExternalLink");
const getExternalLinksFromPage = require("../lib/getExternalLinksFromPage");

const content = `<html>
<body>
  <ul>
    <li><a href="https://example.com">Link 1</a></li>
    <li><a href="https://google.com">Link 2</a></li>
    <li><a href="https://example.com/broken">Link 3</a></li>
  </ul>
</body>
</html>`;

test("store is not empty", (t) => {
  const store = [];
  const dummyThis = { inputPath: "./src/index.md" };
  const config = {};
  const _testFunc = getExternalLinksFromPage(store, defaults, config);
  const testFunc = _testFunc.bind(dummyThis);
  testFunc(content);
  t.is(store.length, 3);
});

test("store contains only ExternalLink items", (t) => {
  const store = [];
  const dummyThis = { inputPath: "./src/index.md" };
  const config = {};
  const _testFunc = getExternalLinksFromPage(store, defaults, config);
  const testFunc = _testFunc.bind(dummyThis);
  testFunc(content);
  t.true(store.every((item) => item instanceof ExternalLink));
});

test("works with specified dir in config", (t) => {
  const store = [];
  const dummyThis = { inputPath: "./src/index.md" };
  const config = { dir: { input: "src" } };
  const _testFunc = getExternalLinksFromPage(store, defaults, config);
  const testFunc = _testFunc.bind(dummyThis);
  testFunc(content);
  t.is(store.length, 3);
});

test("works with two pages", (t) => {
  const store = [];
  const indexPage = { inputPath: "./index.md" };
  const aboutPage = { inputPath: "./about.md" };
  const config = {};
  const _testFunc = getExternalLinksFromPage(store, defaults, config);
  const testFunc1 = _testFunc.bind(indexPage);
  const testFunc2 = _testFunc.bind(aboutPage);
  testFunc1(content);
  testFunc2(content);
  // store should still be 3; identical pages
  t.is(store.length, 3);
  t.true(store.every((link) => link.getLinkCount() === 2));
  t.true(store.every((link) => link.getPages().length === 2));
});
