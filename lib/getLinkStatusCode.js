const debug = require("debug")("Eleventy:plugin-broken-links");
const { AssetCache } = require("@11ty/eleventy-fetch");
const validUrl = require("valid-url");
// const urlStatusCode = require("url-status-code");

const options = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36(KHTML, like Gecko) Chrome/69.0.3464.0 Mobile Safari/537.36",
    Accept: "*/*",
    Connection: "",
  },
};

const getUrlStatusCode = (url) => {
  // import correct node module
  const request = url.startsWith("https://") ? require("https") : require("http");
  // check if valid url
  if (!validUrl.isWebUri(url)) throw new Error("Supplied uri is not valid");

  return new Promise((resolve, reject) => {
    debug(`making request for ${url}`);
    const req = request
      .get(url, options, (res) => {
        const { statusCode } = res;
        debug(`received status code for ${url}: ${statusCode}`);
        resolve(statusCode);
        clearTimeout(timeoutFallback);
        res.destroy();
      })
      .on("error", (error) => reject(error));

    // set a fallback timeout
    const timeoutFallback = setTimeout(() => {
      debug(`timeout for ${url}`);
      reject("Request timed out");
      req.destroy();
    }, 5000);
  });
};

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
    const httpStatusCode = await getUrlStatusCode(url);
    data.httpStatusCode = httpStatusCode;
    debug(`request finished; status is ${httpStatusCode}`);
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      data.httpStatusCode = "ADDRESS NOT FOUND";
    }
    if (error.message === "Supplied uri is not valid") {
      data.httpStatusCode = "INVALID URI";
    }
    if (error.message === "Request timed out") {
      data.httpStatusCode = "REQUEST TIMED OUT";
    }
  } finally {
    debug("saving to cache...");
    await asset.save(data, "json");
    debug("cached saved");
  }
  return data;
};

module.exports = getLinkStatusCode;
