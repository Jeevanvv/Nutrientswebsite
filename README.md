# NutriNest with Megha — Production Architecture

This repository contains the refactored, modular, production-ready source code for **NutriNest with Megha** — a premium clinical nutrition practice based in Bengaluru, India.

---

## Key Highlights

- **Zero-Dependency Static Build**: Pure HTML, modular CSS, ES module JS, and a lightweight Node.js build script (`build.js`).
- **Full Visual Parity**: Preserves 100% of the original design, responsiveness, custom color palette, smooth animations, and typography.
- **23 High-Performance Pages**: Includes 15 specialised nutrition programs, recipe library, online courses, corporate wellness, and about/contact pages.
- **Scalable Architecture**: Adding a new program takes under 10 minutes using `templates/program-template.html`.

---

## Getting Started

### Prerequisites

Node.js (v16 or higher). No `npm install` needed — zero dependencies!

### Building the Site

To build the final HTML pages with injected header and footer partials:

```bash
node build.js
```

The output HTML files are placed directly in the project root for static hosting.

### Local Development

You can serve the directory with any static local web server, for example:

```bash
npx serve .
```

Or open `index.html` in any modern web browser.

---

## Project Structure

- `build.js` — Node.js static site builder
- `partials/` — Reusable header and footer HTML partials
- `src/` — Source HTML pages
- `assets/css/` — 17 modular CSS stylesheets (tokens, reset, layout, components, pages)
- `assets/js/` — Modular Vanilla JS ES modules
- `templates/` — Starter templates for new programs and articles
- `docs/` — Developer documentation (`ARCHITECTURE.md`, `COMPONENTS.md`, `STYLEGUIDE.md`, `ADDING_NEW_PROGRAM.md`)
- `sitemap.xml` & `robots.txt` — SEO configuration
