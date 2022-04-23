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
const brokenLinksPlugin = require('eleventy-plugin-broken-links');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(brokenLinksPlugin);
  // ... the rest of your config
};
```

#### 3. Add `.cache` to `.gitignore`

See [this privacy notice in the `eleventy-fetch` docs](https://www.11ty.dev/docs/plugins/fetch/#installation) about why we should ignore the `.cache` directory. Unless you _really_ know what you're doing, it's probably a good idea.

```bash
.cache/
# ... the rest of your `.gitignore`
```

#### (4. Set options)

There are currently three keys to the optional `option` object passed with `eleventyConfig.addPlugin()`:

| option          | default  | accepted values                                                                                              | description                       |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| `broken`        | `"warn"` | `"warn"`, `"error"`                                                                                          | whether to warn or throw an error |
| `redirect`      | `"warn"` | `"warn"`, `"error"`                                                                                          | same as above                     |
| `cacheDuration` | `"1d"`   | [any value accepted](https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration) by `eleventy-fetch` | set the duration of the cache     |
| `loggingLevel` | `2` | `0` (silent), `1` (only show broken links), `2` (show broken and redirect), `3` (all) | set the logging level |

Here's an example using all options, with the defaults:

```js
const brokenLinksPlugin = require('eleventy-plugin-broken-links');

module.exports = (eleventyConfig) => {
  // ... the rest of your config
  eleventyConfig.addPlugin(brokenLinksPlugin, {
    redirect: 'warn',
    broken: 'warn',
    cacheDuration: '1d',
    loggingLevel: 2
  });
};
```

NOTE: If either the `broken` or `redirect` options are set to `error`, your build will not be successful if there are broken/redirected links!

### Roadmap / Contributing

I don't have a specific roadmap or timeline for this project, but here is a general idea of what the next steps are. If you would like to contribute, please feel free to [file an issue or feature request](https://github.com/bradleyburgess/eleventy-plugin-broken-links/issues), or send a PR.

- [x] cache results (added in `v1.1.0`)
- [x] allow control over logging (added in `v1.3.0`)
- [ ] add option to exclude certain urls (specific urls, domains, regex, etc.)
- [ ] add option to exclude certain input files (specific files, folders, regex, etc.)
- [ ] add debugging using `debug` to hook into the `DEBUG=Eleventy*` workflow
