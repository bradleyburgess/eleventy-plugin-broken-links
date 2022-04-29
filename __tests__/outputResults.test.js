const test = require("ninos")(require("ava"));
const { defaults } = require("../lib/constants");
const ExternalLink = require("../lib/ExternalLink");
const outputResults = require("../lib/outputResults");

test.beforeEach((t) => {
  const links = [
    { url: "https://example.com", code: 200 },
    { url: "https://google.com", code: 301 },
    { url: "https://example.com/broken", code: 404 },
  ];
  const options = { ...defaults, ...{ loggingLevel: 3 } };
  const store = links.map((link) => {
    const storeLink = new ExternalLink(link.url);
    storeLink.setHttpStatusCode(link.code);
    storeLink.addPage("./src/index.md");
    storeLink.incrementLinkCount();
    return storeLink;
  });

  t.context.data = { store, options };
});

test("it outputs something", (t) => {
  const { store, options } = t.context.data;
  const s = t.context.spy(console, "log", () => {});
  outputResults(store, options);

  t.true(s.calls.length > 0);
});

test("contains at least one of each type", (t) => {
  const { store, options } = t.context.data;
  const s = t.context.spy(console, "log", () => {});
  outputResults(store, options);

  t.true(s.calls.some((call) => call.arguments[0].includes("Link okay")));
  t.true(s.calls.some((call) => call.arguments[0].includes("Link is broken")));
  t.true(s.calls.some((call) => call.arguments[0].includes("Link redirects")));
});

test("it outputs status code and pages", (t) => {
  const { store, options } = t.context.data;
  const s = t.context.spy(console, "log", () => {});
  outputResults(store, options);

  const i = s.calls.findIndex((call) => call.arguments[0].includes("Link redirects"));
  t.true(s.calls[i + 1].arguments[0].includes("HTTP Status Code: 301"));
  t.true(s.calls[i + 2].arguments[0].includes("Used 1 time(s) on these pages"));
  t.true(s.calls[i + 3].arguments[0].includes("- ./src/index.md"));
});

test("doesn't show okay links with loggingLevel 2", (t) => {
  const { store, options } = t.context.data;
  options.loggingLevel = 2;
  const s = t.context.spy(console, "log", () => {});
  outputResults(store, options);

  t.true(s.calls.every((call) => !call.arguments[0].includes("Link okay")));
  t.true(s.calls.some((call) => call.arguments[0].includes("Link redirects")));
  t.true(s.calls.some((call) => call.arguments[0].includes("Link is broken")));
});

test("only shows broken with loggingLevel 1", (t) => {
  const { store, options } = t.context.data;
  options.loggingLevel = 1;
  const s = t.context.spy(console, "log", () => {});
  outputResults(store, options);

  t.true(s.calls.every((call) => !call.arguments[0].includes("Link okay")));
  t.true(s.calls.every((call) => !call.arguments[0].includes("Link redirects")));
  t.true(s.calls.some((call) => call.arguments[0].includes("Link is broken")));
});

test("no output with loggingLevel 0", (t) => {
  const { store, options } = t.context.data;
  options.loggingLevel = 0;
  const s = t.context.spy(console, "log", () => {});
  outputResults(store, options);

  t.true(s.calls.length === 0);
});

test("throws with 'error'", (t) => {
  const { store, options } = t.context.data;
  options.broken = "error";
  t.context.spy(console, "log", () => {});
  t.throws(() => outputResults(store, options));
});

test("callback is called", (t) => {
  const { store, options } = t.context.data;
  t.context.spy(console, "log", () => {});
  const s = t.context.stub();
  options.callback = s;
  outputResults(store, options);
  t.is(s.calls.length, 1);
  t.deepEqual(
    s.calls[0].arguments[0],
    store.filter((link) => link.httpStatusCode == 404)
  );
  t.deepEqual(
    s.calls[0].arguments[1],
    store.filter((link) => link.httpStatusCode == 301)
  );
});

test("callback not called if only okay", (t) => {
  const { store, options } = t.context.data;
  const onlyOkayStore = store.filter((link) => link.getHttpStatusCode() == 200);
  t.context.spy(console, "log", () => {});
  const s = t.context.stub();
  options.callback = s;
  outputResults(onlyOkayStore, options);
  t.true(onlyOkayStore.length > 0);
  t.is(s.calls.length, 0);
});
