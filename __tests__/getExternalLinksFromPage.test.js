const { defaults } = require("../lib/constants");
const ExternalLink = require("../lib/ExternalLink");
const getExternalLinksFromPage = require("../lib/getExternalLinksFromPage");

const content = `<html>
<body>
  <ul>
    <li><a href="https://example.com">Link 1</a></li>
    <li><a href="https://google.com">Link 2</a></li>
    <li><a href="https://example.com/broken">Link 3</a></li>
    <li><a>An empty link</a></li>
  </ul>
</body>
</html>`;

describe("getExternalLinksFromPage", () => {
  test("store is not empty", () => {
    const store = [];
    const dummyThis = { inputPath: "./src/index.md" };
    const config = {};
    getExternalLinksFromPage(store, defaults, config).call(dummyThis, content);
    expect(store.length).toBe(3);
  });

  test("store contains only ExternalLink items", () => {
    const store = [];
    const dummyThis = { inputPath: "./src/index.md" };
    const config = {};
    getExternalLinksFromPage(store, defaults, config).call(dummyThis, content);
    expect(store.every((item) => item instanceof ExternalLink)).toBe(true);
  });

  test("works with specified dir in config", () => {
    const store = [];
    const dummyThis = { inputPath: "./src/index.md" };
    const config = { dir: { input: "src" } };
    getExternalLinksFromPage(store, defaults, config).call(dummyThis, content);
    expect(store.length).toBe(3);
  });

  test("works with two pages", () => {
    const store = [];
    const indexThis = { inputPath: "./index.md" };
    const aboutThis = { inputPath: "./about.md" };
    const config = {};
    getExternalLinksFromPage(store, defaults, config).call(indexThis, content);
    getExternalLinksFromPage(store, defaults, config).call(aboutThis, content);
    // store should still be 3; identical pages
    expect(store.length).toBe(3);
    expect(store.every((link) => link.getLinkCount() === 2)).toBe(true);
    expect(store.every((link) => link.getPages().length === 2)).toBe(true);
  });
});
