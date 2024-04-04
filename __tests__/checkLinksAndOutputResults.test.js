const test = require("ninos")(require("ava"));
const checkLinksAndOutputResults = require("../lib/checkLinksAndOuputResults");
const ExternalLink = require("../lib/ExternalLink");
const getExternalLinksFromPage = require("../lib/getExternalLinksFromPage");
const { defaults } = require("../lib/constants");

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

test("everything works", async (t) => {
  const store = [];
  const s = t.context.spy(console, "log", () => {});
  const options = { ...defaults };
  const config = {};

  pages.forEach((page) => {
    getExternalLinksFromPage(store, options, config).call(page, page.content);
  });
  checkLinksAndOutputResults(store, options);

  // check store
  t.true(store.length > 0);
  t.true(store.every((item) => item instanceof ExternalLink));
  t.is(store.length, 6);
  t.is(store.find((item) => item.url === "https://example.com").getLinkCount(), 2);

  // check results
  await checkLinksAndOutputResults(store, options)();
  t.true(s.calls.length > 0);
  t.true(s.calls.some((call) => call.arguments[0].includes("Link forbidden")));
  t.true(s.calls.some((call) => call.arguments[0].includes("Link redirects")));
  t.true(s.calls.some((call) => call.arguments[0].includes("Link is broken")));
});
