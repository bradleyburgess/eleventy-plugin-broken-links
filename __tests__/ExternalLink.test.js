const ExternalLink = require("../lib/ExternalLink");
const test = require("ava");

test("ExternalLink", (t) => {
  const url = "https://example.com";
  const link = new ExternalLink(url);
  link.setHttpStatusCode(200);
  link.addPage("./src/index.md");
  link.addPage("./src/about.md");

  let httpStatusCode = link.getHttpStatusCode();
  let linkCount = link.getLinkCount();
  let pages = link.getPages();
  t.is(link.url, url);
  t.is(httpStatusCode, "200");
  t.is(linkCount, 0);
  t.deepEqual(pages, ["./src/index.md", "./src/about.md"]);

  linkCount = link.incrementLinkCount();
  link.addPage("./src/index.md");
  pages = link.getPages();
  t.is(linkCount, 1);
  t.deepEqual(pages, ["./src/index.md", "./src/about.md"]);
});
