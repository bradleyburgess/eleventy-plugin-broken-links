const ExternalLink = require("../lib/ExternalLink");

describe("ExternalLink", () => {
  test("constructor and methods", () => {
    const url = "https://example.com";
    const link = new ExternalLink(url);
    link.setHttpStatusCode("200");
    link.addPage("./src/index.md");
    link.addPage("./src/about.md");

    let httpStatusCode = link.getHttpStatusCode();
    let linkCount = link.getLinkCount();
    let pages = link.getPages();

    expect(link.url).toBe(url);
    expect(httpStatusCode).toBe("200");
    expect(linkCount).toBe(0);
    expect(pages).toEqual(["./src/index.md", "./src/about.md"]);

    linkCount = link.incrementLinkCount();
    link.addPage("./src/index.md");
    pages = link.getPages();

    expect(linkCount).toBe(1);
    expect(pages).toEqual(["./src/index.md", "./src/about.md"]);
  });
});
