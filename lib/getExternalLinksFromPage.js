const { parse } = require("node-html-parser");
const ExternalLink = require("./ExternalLink");

function getExternalLinksFromPage(store) {
  return function (content) {
    // this.inputPath coming from eleventyConfig context
    const { inputPath } = this;

    // collect all external links on this page
    const _externalPageLinks = parse(content)
      .getElementsByTagName("a")
      .map((anchor) => anchor.getAttribute("href"))
      .filter((url) => url.startsWith("http"));

    // eliminate duplicates using `Set`
    const externalPageLinks = new Set(_externalPageLinks);

    // - check if the store has this url; if not create a new instance
    // - add this page to the list of pages
    // - increment the link count
    externalPageLinks.forEach((link) => {
      let storeLink = store.find((elem) => elem.url === link);
      if (!storeLink) storeLink = new ExternalLink(link);
      storeLink.addPage(inputPath);
      storeLink.incrementLinkCount();
      store.push(storeLink);

      // --- original logic
      // if (!store[link]) store[link] = new ExternalLink(link);
      // store[link].addPage(inputPath);
      // store[link].incrementLinkCount();
      // ---
    });
  };
}

module.exports = getExternalLinksFromPage;
