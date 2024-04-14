const checkLinksAndOutputResults = require("../lib/checkLinksAndOuputResults");
const ExternalLink = require("../lib/ExternalLink");
const getExternalLinksFromPage = require("../lib/getExternalLinksFromPage");
const { defaults } = require("../lib/constants");

const SECONDS = 1000;
jest.setTimeout(10 * SECONDS);

const pages = [
  {
    inputPath: "./src/index.md",
    content: `<html>
<body>
  <h1>Home Page</h1>
  <p>Here are some links:</p>
    <ul>
        <li><a href="https://example.com">Example.com</a></li>
        <li><a href="https://google.com">Google.com</a></li>
        <li><a href="https://example.com/broken">Broken Link #1</a></li>
        <li><a href="https://www.raspberrypi.com/software/">Forbidden Link #1</a></li>
    </ul>
</body>
</html>`,
  },
  {
    inputPath: "./src/about.md",
    content: `<html>
<body>
  <h1>About Page</h1>
  <p>Here are some links:</p>
    <ul>
        <li><a href="https://example.com">Example.com</a></li>
        <li><a href="https://yahoo.com">Yahoo.com</a></li>
        <li><a href="https://example.com/broken2">Broken Link #1</a></li>
        <li><a href="https://www.raspberrypi.com/software/">Forbidden Link #1</a></li>
    </ul>
</body>
</html>`,
  },
];

describe("checkLinksAndOutputResults", () => {
  test("everything works", async () => {
    const store = [];
    const s = jest.spyOn(console, "log").mockImplementation(() => {});
    const options = { ...defaults };
    const config = {};

    pages.forEach((page) => {
      getExternalLinksFromPage(store, options, config).call(page, page.content);
    });
    checkLinksAndOutputResults(store, options);

    // check store
    expect(store.length).toBeGreaterThan(0);
    expect(store.every((item) => item instanceof ExternalLink)).toBe(true);
    expect(store.length).toBe(6);
    expect(store.find((item) => item.url === "https://example.com").getLinkCount()).toBe(2);

    // check results
    await checkLinksAndOutputResults(store, options)();
    expect(s.mock.calls.length).toBeGreaterThan(0);
    expect(s.mock.calls.some((call) => call[0].includes("Link forbidden"))).toBe(true);
    expect(s.mock.calls.some((call) => call[0].includes("Link redirects"))).toBe(true);
    expect(s.mock.calls.some((call) => call[0].includes("Link is broken"))).toBe(true);
  });
});
