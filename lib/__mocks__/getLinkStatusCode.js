const linksToCheck = [
  { url: "https://www.example.com", status: 200 },
  { url: "https://google.com", status: 301 },
  { url: "https://www.google.com/404", status: 404 },
  { url: "https://www.raspberrypi.com/software/", status: 504 },
  { url: "https://codepen.io", status: 403 },
];

async function getLinkStatusCode(url) {
  const link = linksToCheck.find((item) => item.url === url);
  return {
    url,
    httpStatusCode: link ? link.status : 200,
  };
}

module.exports = getLinkStatusCode;
exports = module.exports;
exports.linksToCheck = linksToCheck;
