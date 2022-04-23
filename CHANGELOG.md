# Changelog

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
