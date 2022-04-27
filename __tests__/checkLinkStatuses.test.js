const test = require("ava");
const ExternalLink = require("../lib/ExternalLink");
const checkLinkStatuses = require("../lib/checkLinkStatuses");

const linksToCheck = [
  "https://example.com",
  "https://google.com",
  "https://example.com/brokenlink",
];

const store = linksToCheck.map((link) => new ExternalLink(link));

test("all links have statuses", async (t) => {
  await checkLinkStatuses(store, "1d");
  console.log(store);
  t.true(store.every((item) => item.getHttpStatusCode() !== null));
  t.true(store.some((link) => link.getHttpStatusCode() == 301));
  t.true(store.some((link) => link.getHttpStatusCode() == 404));
  t.true(store.some((link) => link.getHttpStatusCode() == 200));
});
