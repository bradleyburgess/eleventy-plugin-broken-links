const test = require("ava");
const ExternalLink = require("../lib/ExternalLink");
const checkLinkStatuses = require("../lib/checkLinkStatuses");

const linksToCheck = [
  "https://example.com",
  "https://google.com",
  "https://google.com/404",
  "https://www.raspberrypi.com/software/",
];

const store = linksToCheck.map((link) => new ExternalLink(link));

test("all links have statuses", async (t) => {
  await checkLinkStatuses(store, "1d");
  t.true(store.every((item) => item.getHttpStatusCode() !== null));
  t.true(store.some((link) => link.getHttpStatusCode() == 301));
  t.true(store.some((link) => link.getHttpStatusCode() == 403));
  t.true(store.some((link) => link.getHttpStatusCode() == 404));
  t.true(store.some((link) => link.getHttpStatusCode() == 200));
});
