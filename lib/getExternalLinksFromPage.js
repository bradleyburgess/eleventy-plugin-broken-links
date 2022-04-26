const { parse } = require("node-html-parser");
const ExternalLink = require("./ExternalLink");
const { shouldExcludeLink, shouldExcludePage } = require("./helpers");

function getExternalLinksFromPage(store, options, config) {
  return function (content) {
    // this.inputPath comes from eleventyConfig context
    const { inputPath } = this;
    const dirInput = config.dir?.input ?? undefined;
    if (shouldExcludePage(inputPath, dirInput, options.excludeInputs)) return;

    // collect all external links on this page
    const _externalPageLinks = parse(content)
      .getElementsByTagName("a")
      .map((anchor) => anchor.getAttribute("href"))
      .filter((url) => url.startsWith("http"));

    // remove duplicates
    const externalPageLinks = new Set(_externalPageLinks);

    externalPageLinks.forEach((link) => {
      // filter out excluded urls
      if (shouldExcludeLink(link, options.excludeUrls)) return;

      // check if link exists in store; create new ExternalLink if not
      let storeLink = store.find((elem) => elem.url === link);
      if (!storeLink) storeLink = new ExternalLink(link);

      storeLink.addPage(inputPath);
      storeLink.incrementLinkCount();
      store.push(storeLink);
    });
  };
}

module.exports = getExternalLinksFromPage;
