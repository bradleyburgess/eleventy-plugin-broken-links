# Changelog

## 1.5.6 (04/28/2022)

- refactored `eleventy.after` plugin for better testing
- added tests for:
  - `logger.js`
  - `checkLinksAndOutputResults.js`
- added GitHub workflow for Codecov
- added Codecov badge to README

---

## 1.5.5 (04/27/2022)

- added remaining tests
- 100% coverage on all modules

---

## 1.5.4 (04/27/2022)

- added AVA and NYC
- added tests for:
  - `ExternalLink` class
  - `getExternalLinkFromPage`
  - `helpers.js`
  - `validateUserOptions`
- fixed bug caught by tests which resulted in duplicate `ExternalLink` entries in store

---

## 1.5.0 (04/26/2022)

- added validations for `excludeUrls` values
- added `excludeInputs` feature

---

## 1.4.2 (04/25/2022)

- fix table bug in `README`

---

## 1.4.1 (04/25/2022)

- tweak README for readability and comprehensiveness

---

## 1.4.0 (04/25/2022)

- added `excludeUrls` option

---

## 1.3.3 (04/25/2022)

- refactored `store` as an `Array` for better manipulation
  - `ExternalLink` now includes `url` prop
- refactored `getExternalLinksFromPage`
  - generates a new function to allow for user options, ahead of implementing `exclude` functionality
- improved validations

---

## 1.3.2 (04/23/2022)

- added note about `.gitignore`ing `.cache` to `README`
- added roadmap / contributing to `README`

---

## 1.3.1 (04/23/2022)

- patch redirect logging (wasn't showing url)

---

## 1.3.0 (04/23/2022)

- implemented custom logging in separate class
- added `loggingLevel` to options, allowing for control of console output:
  - `0`: silent
  - `1`: only broken links logged
  - `2`: broken links and redirects
  - `3`: all (verbose)

---

## 1.2.1 (04/23/2022)

- patch error from empty `httpStatusCode`

---

## 1.2.0 (04/22/2022)

- major refactor: `ExternalLink` class
- implemented `store` for storing external link data
- group URLs by _link_, not by _page_, thus checking URLs once only
- added `eslint` to dev environment

---

## 1.1.0 (04/21/2022)

- implemented cache using `eleventy-fetch`.
- options now include:
  - `cacheDuration` to specify length of cache (based on options for `eleventy-fetch`)

---

## 1.0.0 (04/21/2022)

- first working version
- basic options:
  - `broken`: should broken links `error` or `warn`?
  - `redirect`: as above
