## eleventy-plugin-broken-links

[![npm](https://img.shields.io/npm/v/eleventy-plugin-broken-links)](https://www.npmjs.com/package/eleventy-plugin-broken-links)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is an [11ty](https://www.11ty.dev/) to check for broken external links after a build.

Currently it only checks _external_ links, but I might add internal links at some point. (Feel free to send a PR.)

The plugin uses `node-html-parser` and `url-status-code` under the hood.

### Usage

#### 1. Install the plugin

NPM:

```bash
npm i -D eleventy-plugin-broken-links
```

Yarn:

```bash
yarn add -D eleventy-plugin-broken-links
```

#### 2. Add to `.eleventy.js` config

```js
const brokenLinksPlugin = require('eleventy-plugin-broken-links`);

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(brokenLinksPlugin);
  // ... the rest of your config
};
```

There are options to `warn` or `error` on a broken or redirected link:

```js
const brokenLinksPlugin = require('eleventy-plugin-broken-links`);

module.exports = (eleventyConfig) => {
  // ... the rest of your config
  eleventyConfig.addPlugin(brokenLinksPlugin, {
    redirect: 'warn', // default
    broken: 'error'   // default: 'warn'
  });
};
```

If either option is set to `error`, your build will not be successful if there are broken/redirected links!

### Contributing

I don't have a roadmap or plan with this plugin. It's my first one, and I just needed the functionality, so wrote it rather quickly.

That said, feel free to do a PR or create an issue.
