# henvag.github.io

My developer portfolio: https://henvag.github.io/

Plain HTML, CSS and a little JavaScript, served by GitHub Pages straight from `main`. There is no build step.

- `index.html` holds the page and its English copy.
- `assets/js/site.js` holds the Norwegian copy (the `NO` table), the language toggle, the Spotify player, the two carousels, the screenshot lightbox and the animation trigger.
- `assets/css/site.css` holds the look: the navy and violet from the H DEV logo, Anton for headings, IBM Plex Sans for text.
- `assets/img` and `assets/video` hold the Tenant Access screenshots and the row-level security clip, taken from the read-only demo company.

To preview locally, run `python3 -m http.server` in this folder and open http://localhost:8000.

When adding text, give the element a `data-i18n` key and add the Norwegian version under the same key in `site.js`.
