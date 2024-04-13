const ExternalLink = require("../lib/ExternalLink");
const checkLinkStatuses = require("../lib/checkLinkStatuses");

jest.mock("../lib/ExternalLink");

const linksToCheck = [
  "https://www.example.com",
  "https://www.google.com",
  "https://www.google.com/404",
  "https://www.raspberrypi.com/software/",
];

const store = linksToCheck.map((link) => new ExternalLink(link));

test("all links have statuses", async () => {
  await checkLinkStatuses(store, "1d");
  expect(store.every((item) => item.getHttpStatusCode() !== null)).toBe(true);
  expect(store.some((link) => link.getHttpStatusCode() == 301)).toBe(true);
  expect(store.some((link) => link.getHttpStatusCode() == 403)).toBe(true);
  expect(store.some((link) => link.getHttpStatusCode() == 404)).toBe(true);
  expect(store.some((link) => link.getHttpStatusCode() == 200)).toBe(true);
});
