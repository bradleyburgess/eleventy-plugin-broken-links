const store = require("./store");
const { parse } = require("node-html-parser");
const ExternalLink = require("./ExternalLink");

function getExternalLinksFromPage(content) {
  // this.inputPath coming from eleventyConfig file
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
    if (!store[link]) store[link] = new ExternalLink();
    store[link].addPage(inputPath);
    store[link].incrementLinkCount();
  });
}

module.exports = getExternalLinksFromPage;
