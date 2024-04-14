const getLinkStatusCode = require("../lib/getLinkStatusCode");

describe("getLinkStatusCode", () => {
  test("returns 200", async () => {
    const { httpStatusCode } = await getLinkStatusCode("https://example.com");
    expect(httpStatusCode).toBe(200);
  });

  test("returns 404", async () => {
    const { httpStatusCode } = await getLinkStatusCode("https://blog.davidmoll.net/broken-link");
    expect(httpStatusCode).toBe(404);
  });

  test("returns 403", async () => {
    const { httpStatusCode } = await getLinkStatusCode("https://codepen.io");
    expect(httpStatusCode).toBe(403);
  });

  test("returns 301", async () => {
    const { httpStatusCode } = await getLinkStatusCode("https://google.com");
    expect(httpStatusCode).toBe(301);
  });

  test('returns "ADDRESS NOT FOUND"', async () => {
    const { httpStatusCode } = await getLinkStatusCode("https://asdlfkajsdlfkjaslkdfj.com");
    expect(httpStatusCode).toBe("ADDRESS NOT FOUND");
  });

  test('returns "INVALID URI"', async () => {
    const { httpStatusCode } = await getLinkStatusCode("sdlfkj");
    expect(httpStatusCode).toBe("INVALID URI");
  });
});
