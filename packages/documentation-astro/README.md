# Documentation in Astro

This package is an attempt in converting the existing documentation located at `../documentation` to an astro static page.

The goal is to keep all the content (assets, markdown files) withion the old documentation for now (so it does not go out of sync).

All the pages implemented should follow the existing components within the `../documentation` and `../design-system` folders.

When tasked to migrate a page follow these steps:
- find the corresponding page within the old docs, trace the components
- create the new components as astro components (keep markdown and classes identical if possible)
- implement the new pages
- leverage playwrigth/chromium for visually diffing the pages


## Missing pages

- [ ] `/ecosystem`
- [ ] `/gateway`
- [ ] `/blog`
- [ ] `/product-updates`
