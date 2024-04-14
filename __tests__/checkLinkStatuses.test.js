const ExternalLink = require("../lib/ExternalLink");
const checkLinkStatuses = require("../lib/checkLinkStatuses");
const { linksToCheck } = require("../lib/__mocks__/getLinkStatusCode");

jest.mock("../lib/getLinkStatusCode");

const store = linksToCheck.map((link) => new ExternalLink(link.url));

test("all links have statuses", async () => {
  await checkLinkStatuses(store, "1d");
  expect(store.every((item) => item.getHttpStatusCode() !== null)).toBe(true);
  expect(store.some((link) => link.getHttpStatusCode() == 301)).toBe(true);
  expect(store.some((link) => link.getHttpStatusCode() == 403)).toBe(true);
  expect(store.some((link) => link.getHttpStatusCode() == 404)).toBe(true);
  expect(store.some((link) => link.getHttpStatusCode() == 200)).toBe(true);
});
