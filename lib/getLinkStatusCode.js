const debug = require("debug")("Eleventy:plugin-broken-links");
const { AssetCache } = require("@11ty/eleventy-fetch");
const urlStatusCode = require("url-status-code");

const getLinkStatusCode = async (url, cacheDuration) => {
  debug(`checking status of ${url} ...`);
  const asset = new AssetCache(url);
  if (asset.isCacheValid(cacheDuration)) {
    debug("valid cache value found; returning cached value");
    return asset.getCachedValue();
  }

  const data = { url };
  try {
    debug("no valid cache found; checking status...");
    const httpStatusCode = await urlStatusCode(url);
    data.httpStatusCode = httpStatusCode;
    debug(`request finished; status is ${httpStatusCode}`);
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      data.httpStatusCode = "ADDRESS NOT FOUND";
    }
    if (error.message === "Supplied uri is not valid") {
      data.httpStatusCode = "INVALID URI";
    }
  } finally {
    debug("saving to cache...");
    await asset.save(data, "json");
    debug("cached saved");
  }
  return data;
};

module.exports = getLinkStatusCode;
