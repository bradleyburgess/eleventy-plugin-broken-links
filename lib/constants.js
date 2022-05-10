const defaults = {
  broken: "warn",
  redirect: "warn",
  cacheDuration: "1d",
  loggingLevel: 2,
  excludeUrls: ["http://localhost*", "https://localhost*"],
  excludeInputs: [],
  callback: null,
};

module.exports = { defaults };
