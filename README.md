## eleventy-plugin-broken-links

[![npm](https://img.shields.io/npm/v/eleventy-plugin-broken-links)](https://www.npmjs.com/package/eleventy-plugin-broken-links)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is an [11ty](https://www.11ty.dev/) plugin to check for broken external links after a build.

Currently it only checks _external_ links, but I might add internal links at some point. (Feel free to send a PR.)

The plugin uses `node-html-parser` and `url-status-code` under the hood, and caches results using `eleventy-fetch`.

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

#### 3. Set options

There are currently three keys to the optional `option` object passed with `eleventyConfig.addPlugin()`:

| option          | default  | accepted values                                                                                              | description                       |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| `broken`        | `"warn"` | `"warn"`, `"error"`                                                                                          | whether to warn or throw an error |
| `redirect`      | `"warn"` | `"warn"`, `"error"`                                                                                          | same as above                     |
| `cacheDuration` | `"1d"`   | [any value accepted](https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration) by `eleventy-fetch` | set the duration of the cache     |

Here's an example using all options, with the defaults:

```js
const brokenLinksPlugin = require('eleventy-plugin-broken-links`);

module.exports = (eleventyConfig) => {
  // ... the rest of your config
  eleventyConfig.addPlugin(brokenLinksPlugin, {
    redirect: 'warn',
    broken: 'warn',
    cacheDuration: '1d'
  });
};
```

NOTE: If either the `broken` or `redirect` options are set to `error`, your build will not be successful if there are broken/redirected links!

### Contributing

I don't have a roadmap or plan with this plugin. It's my first one, and I just needed the functionality, so wrote it rather quickly.

That said, feel free to do a PR or create an issue.
