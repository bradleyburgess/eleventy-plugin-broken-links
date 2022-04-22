const { AssetCache } = require("@11ty/eleventy-fetch");
const urlStatusCode = require("url-status-code");

const getLinkStatusCode = async (url, duration) => {
  const asset = new AssetCache(url);
  if (asset.isCacheValid(duration)) {
    return asset.getCachedValue();
  }

  const data = { url };
  try {
    const httpStatusCode = await urlStatusCode(url);
    data.httpStatusCode = httpStatusCode;
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      data.httpStatusCode = 404;
    }
  } finally {
    await asset.save(data, "json");
  }
  return data;
};

module.exports = getLinkStatusCode;
