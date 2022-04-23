const { AssetCache } = require("@11ty/eleventy-fetch");
const urlStatusCode = require("url-status-code");

const getLinkStatusCode = async (url, cacheDuration) => {
  const asset = new AssetCache(url);
  if (asset.isCacheValid(cacheDuration)) {
    return asset.getCachedValue();
  }

  const data = { url };
  try {
    const httpStatusCode = await urlStatusCode(url);
    data.httpStatusCode = httpStatusCode;
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      data.httpStatusCode = "ADDRESS NOT FOUND";
    }
    if (error.message === "Supplied uri is not valid") {
      data.httpStatusCode = "INVALID URI";
    }
  } finally {
    await asset.save(data, "json");
  }
  return data;
};

module.exports = getLinkStatusCode;
