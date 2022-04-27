const test = require("ava");
const getLinkStatusCode = require("../lib/getLinkStatusCode");

test("returns 200", async (t) => {
  const { httpStatusCode } = await getLinkStatusCode("https://example.com");
  t.is(httpStatusCode, 200);
});

test("returns 404", async (t) => {
  const { httpStatusCode } = await getLinkStatusCode("https://example.com/broken");
  t.is(httpStatusCode, 404);
});

test("returns 301", async (t) => {
  const { httpStatusCode } = await getLinkStatusCode("https://google.com");
  t.is(httpStatusCode, 301);
});

test('returns "ADDRESS NOT FOUND"', async (t) => {
  const { httpStatusCode } = await getLinkStatusCode("https://asdlfkajsdlfkjaslkdfj.com");
  t.is(httpStatusCode, "ADDRESS NOT FOUND");
});

test('returns "INVALID URI"', async (t) => {
  const { httpStatusCode } = await getLinkStatusCode("sdlfkj");
  t.is(httpStatusCode, "INVALID URI");
});
