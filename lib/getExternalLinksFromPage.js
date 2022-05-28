const debug = require("debug")("Eleventy:plugin-broken-links");
const { parse } = require("node-html-parser");
const ExternalLink = require("./ExternalLink");
const { shouldExcludeLink, shouldExcludePage } = require("./helpers");

function getExternalLinksFromPage(store, options, config) {
  return function (content) {
    debug("getting external links from pages...");
    // this.inputPath comes from eleventyConfig context
    const { inputPath } = this;
    const dirInput = config.dir?.input ?? undefined;
    if (shouldExcludePage(inputPath, dirInput, options.excludeInputs)) {
      debug(`page ${inputPath} found in \`excludeInputs\`; skipping`);
      return;
    }

    // collect all external links on this page
    const _externalPageLinks = parse(content)
      .getElementsByTagName("a")
      .map((anchor) => anchor.getAttribute("href"))
      .filter((url) => url?.startsWith("http"));

    // remove duplicates
    const externalPageLinks = new Set(_externalPageLinks);

    externalPageLinks.forEach((link) => {
      // filter out excluded urls
      if (shouldExcludeLink(link, options.excludeUrls)) {
        debug(`link ${link} from in \`excludeUrls\`; skipping`);
        return;
      }

      // check if link exists in store; create new ExternalLink if not
      let storeLink = store.find((elem) => elem.url === link);
      if (!storeLink) {
        storeLink = new ExternalLink(link);
        store.push(storeLink);
      }

      storeLink.addPage(inputPath);
      storeLink.incrementLinkCount();
      debug("done getting external links");
    });
  };
}

module.exports = getExternalLinksFromPage;
