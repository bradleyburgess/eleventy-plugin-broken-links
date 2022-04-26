# eleventy-plugin-broken-links

[![npm](https://img.shields.io/npm/v/eleventy-plugin-broken-links)](https://www.npmjs.com/package/eleventy-plugin-broken-links)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of contents

- [Overview](#overview)
  - [Features](#features)
- [Usage](#usage)
  - [1. Install the plugin](#1-install-the-plugin)
  - [2. Add to `.eleventy.js` config](#2-add-to-eleventyjs-config)
  - [3. Add `.cache` to `.gitignore`](#3-add-cache-to-gitignore)
  - [(4. Set options)](#4-set-options) 
- [Options](#options)
  - [`broken` and `redirect`](#broken-and-redirect)
  - [`cacheDuration`](#cacheduration)
  - [`loggingLevel`](#logginglevel)
  - [`excludeUrls`](#excludeurls)
  - [`excludeInputs`](#excludeinputs)
- [Roadmap / Contributing](#roadmap--contributing)

---

## Overview

This is an [11ty](https://www.11ty.dev/) plugin to check for broken external 
links after a build.

Currently it only checks _external_ links, but I might add internal links at 
some point.

The plugin uses `node-html-parser` and `url-status-code` under the hood, and 
caches results using `eleventy-fetch`.

### Features

- caching using `eleventy-fetch`
- excluding URLs
- control of level of logging
- warn or error on broken or redirected links

---

## Usage

### 1. Install the plugin

NPM:

```bash
npm i -D eleventy-plugin-broken-links
```

Yarn:

```bash
yarn add -D eleventy-plugin-broken-links
```

### 2. Add plugin to `.eleventy.js` config

```js
const brokenLinksPlugin = require('eleventy-plugin-broken-links');

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(brokenLinksPlugin);
  // ... the rest of your config
};
```

### 3. Add `.cache` to `.gitignore`

See [this privacy notice in the `eleventy-fetch` docs](https://www.11ty.dev/docs/plugins/fetch/#installation) 
about why we should ignore the `.cache` directory. Unless you _really_ know 
what you're doing, it's probably a good idea.

```bash
.cache/
# ... the rest of your `.gitignore`
```

### (4. Set options)

There are currently 5 possible keys to the optional `options` object passed 
with `eleventyConfig.addPlugin()`:

| Option                             | Default  | Accepted values                                                                                               | Description                        |
| ---------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [`broken`](#broken-and-redirect)   | `"warn"` | `"warn"`, `"error"`                                                                                           | Whether to warn or throw an error  |
| [`redirect`](#broken-and-redirect) | `"warn"` | `"warn"`, `"error"`                                                                                           | (same as above)                    |
| [`cacheDuration`](#cacheduration)  | `"1d"`   | [any value accepted](https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration) by `eleventy-fetch`  | Set the duration of the cache      |
| [`loggingLevel`](#logginglevel)    | `2`      | Integer `0` (silent) to `3` (all)                                                                             | Set the logging level              |
| [`excludeUrls`](#excludeurls)      | `[]`     | Array of URL strings                                                                                          | Exclude specific URLs or wildcards |
| [`excludeInputs`](#excludeinputs)  | `[]`     | Array of globs, **relative to `eleventyConfig.dir.input` value**                                              | Exclude input files / globs        |

Here's an example using all options, with the defaults:

```js
const brokenLinksPlugin = require('eleventy-plugin-broken-links');

module.exports = (eleventyConfig) => {
  // ... the rest of your config
  eleventyConfig.addPlugin(brokenLinksPlugin, {
    redirect: 'warn',
    broken: 'warn',
    cacheDuration: '1d',
    loggingLevel: 2,
    excludeUrls: [],
    excludeInputs: []
  });
};
```

NOTE: If either the `broken` or `redirect` options are set to `error`, your 
build will not be successful if there are broken/redirected links!

---

## Options

### `broken` and `redirect`

- __Default: `"warn"`__
- Accepted: `"warn"` or `"error"`

Whether to `warn` or `error` if broken or redirect links are found. If `error`, 
builds will not succeed if any are found.

### `cacheDuration`

- __Default: `"1d"`__
- Accepted: Anything accepted by `eleventy-fetch` plugin

Sets the cache duration for checking URL status codes. See the 
[`eleventy-fetch` plugin docs](https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration) 
for more info.

### `loggingLevel`

- __Default: `2`__
- Accepted: Integer `0` to `3`

| Level | Result                             |
| ----- | ---------------------------------- |
| `0`   | Silent                             |
| `1`   | Only log broken links              |
| `2`   | Only log broken and redirect links |
| `3`   | All (verbose)                      |

### `excludeUrls`

- __Default: `[]`__
- Accepted: Array of URL strings

You can exclude specific URLs by specifying their fully-qualified uri:

```js
excludeUrls: ['https://example.com']
```

But you can also use a wildcard (`*`) to exclude domains or sub-paths. Examples:

```js
"https://example.com"          // excludes only the root URL, 
                               // but sub-paths will be include, 
                               // e.g. 'https://example.com/about'

"https://example.com/about"    // excludes only '/about', but root and other
                               // pages are included

"https://example.com/about/*"  // excludes any path nested under 'about', 
                               // but includes 'about'

"https://example.com/about*"   // excludes any sub-path that begins 
                               // with `about`, INCLUDING all nested paths

"https://example.com/*"        // excludes all paths, but includes the root

"https://example.com*"         // excludes the root and all paths
```

Note that the URLs specified need to be fully-qualified, so sub-domains need to 
be explicitly indicated.

### `excludeInputs`

- __Default: `[]`__
- Accepted: Array of files or globs, relative to `dir.input`

You can exclude specific input files by providing an array of files or globs.

Please note:

- **All files and globs are relative to the config `dir.input` value**
- Leading "dot-slash" (`./`) is optional, and is stripped from the input
  filenames and `excludeInputs` values when normalized before processing

To illustrate these points:

```js
// - `dir.input` not set in config (`undefined`)
["index.md"]            // exclude only ./index.md
["./index.md"]          // identical to above

// - `dir.input` = "src":
["index.md"]            // exclude ./src/index.md
```

Globbing is handled by `minimatch` under the hood. Some examples:

```js
// Some globbing examples:
["**/index.md"]         // exclude all index.md files recursively
["**/*.md"]             // exclude all .md files recursively
["notes/**"]            // exclude all files recursively in 'notes'
["**/./*.md"]           // exclude all .md files in subdirectories only
["**/+(foo|bar).md"]    // exclude all files named "foo.md" or "bar.md"
```

---

## Roadmap / Contributing

I don't have a specific roadmap or timeline for this project, but here is a 
general idea of what the next steps are. If you would like to contribute, 
please feel free to 
[file an issue or feature request](https://github.com/bradleyburgess/eleventy-plugin-broken-links/issues), 
or send a PR.

- [x] cache results (added in `v1.1.0`)
- [x] allow control over logging (added in `v1.3.0`)
- [x] add option to exclude certain urls (added in `v1.4.0`)
- [x] add option to exclude certain input files
- [ ] add debugging using `debug` to hook into the `DEBUG=Eleventy*` workflow
