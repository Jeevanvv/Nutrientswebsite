# NutriNest Architecture Guide

## Overview

NutriNest is structured as a **modular, plain-HTML multi-page application** powered by a lightweight Node.js build step (`build.js`). It requires **zero runtime framework dependencies** and produces clean, SEO-optimised static HTML files ready for instant deployment on any host (Vercel, Netlify, GitHub Pages, Apache, Nginx).

---

## Directory Organization

```
c:\Users\jeeva\Desktop\Megha\nutrinest\
│
├── build.js                           ← Static page generator (injects header/footer partials)
├── partials/
│   ├── header.html                    ← Shared header partial (logo, mega-menu, nav)
│   └── footer.html                    ← Shared footer partial (links, contact, copyright)
│
├── src/                               ← Source pages (contain <!-- INCLUDE:... --> markers)
│   ├── index.html                     ← Home page
│   ├── about.html                     ← About Megha
│   ├── contact.html                   ← Consultation booking & contact page
│   ├── corporate.html                 ← Redirect alias to corporate-wellness.html
│   ├── privacy.html                   ← Privacy policy
│   ├── terms.html                     ← Terms of service
│   ├── styleguide.html                ← Living styleguide & design tokens
│   ├── programs/                      ← Individual and corporate program pages
│   │   ├── index.html                 ← Programs directory
│   │   ├── one-on-one-nutrition-coaching.html
│   │   ├── womens-health.html
│   │   ├── child-nutrition.html
│   │   ├── preventive-care.html
│   │   ├── group-coaching.html
│   │   ├── corporate-wellness.html
│   │   ├── institution-wellness.html
│   │   ├── community-wellness.html
│   │   ├── b2b-nutrition-solutions.html
│   │   ├── ngo-community-health.html
│   │   ├── special-needs-nutrition.html
│   │   ├── sports-nutrition.html
│   │   └── membership.html
│   └── resources/                     ← Content library pages
│       ├── recipes.html
│       └── courses.html
│
├── assets/
│   ├── css/                           ← 17 modular CSS stylesheets
│   │   ├── variables.css              ← Design tokens (:root properties)
│   │   ├── reset.css                  ← Normalisation & focus rings
│   │   ├── typography.css             ← Type hierarchy & headings
│   │   ├── layout.css                 ← Grids, wraps, sections, bands
│   │   ├── buttons.css                ← Button variants (.btn, .btn--primary, .btn--ghost)
│   │   ├── cards.css                  ← Cards, steps, callouts, tables, quotes
│   │   ├── navigation.css             ← Header, mega-menu, mobile toggle
│   │   ├── hero.css                   ← Hero section layout & background
│   │   ├── forms.css                  ← Form fields, labels, inputs, hints
│   │   ├── accordion.css              ← FAQ accordions & aria state
│   │   ├── tabs.css                   ← Tabbed content panels
│   │   ├── carousel.css               ← Scroll-snap testimonial carousels
│   │   ├── pricing.css                ← Pricing grid & featured card
│   │   ├── footer.css                 ← Site footer layout
│   │   ├── utilities.css              ← Chips, related cards, shots, marquee, stats, sticky CTA
│   │   ├── animations.css             ← Scroll-reveal keyframes & motion rules
│   │   └── pages/                     ← Page-specific overrides
│   │       ├── home.css
│   │       ├── program.css
│   │       ├── corporate.css
│   │       └── contact.css
│   │
│   ├── js/                            ← ES modules
│   │   ├── main.js                    ← Application entry point (imports & initialises modules)
│   │   ├── navbar.js                  ← Hamburger menu & mega-menu dropdowns
│   │   ├── accordion.js               ← Accordion expand/collapse
│   │   ├── tabs.js                    ← Tab switching & keyboard navigation
│   │   ├── carousel.js                ← Testimonial carousel controls
│   │   ├── counters.js                ← Animated stat counters on scroll
│   │   ├── animations.js              ← IntersectionObserver scroll-reveal
│   │   ├── forms.js                   ← Form demo mode handling
│   │   ├── filters.js                 ← Category chip filters (recipes/courses)
│   │   ├── sticky-cta.js              ← Mobile sticky CTA bar
│   │   └── utils.js                   ← DOM & debounce helpers
│   │
│   ├── images/                        ← Image assets by category
│   └── fonts/                         ← Custom fonts
│
├── templates/                         ← Starter templates for new pages
│   ├── program-template.html
│   └── article-template.html
│
└── docs/                              ← Developer & AI assistant documentation
    ├── ARCHITECTURE.md
    ├── COMPONENTS.md
    ├── STYLEGUIDE.md
    └── ADDING_NEW_PROGRAM.md
```

---

## Build Workflow (`build.js`)

To keep pages DRY (Don't Repeat Yourself) without forcing a dynamic server or framework:

1. Edit page content inside `src/`. Page files include:
   - `<!-- INCLUDE:header -->` where the navigation goes.
   - `<!-- INCLUDE:footer -->` where the footer goes.
2. Run `node build.js`.
3. The build script reads `src/`, injects `partials/header.html` and `partials/footer.html`, sets `aria-current="page"` on active navigation links matching the URL, and writes the output directly to the project root.
4. Host the root folder as standard static HTML.

---

## Design System & CSS Cascade Order

Every page imports stylesheets in a specific cascade order:

1. `variables.css` (Tokens MUST load first)
2. `reset.css`
3. `typography.css`
4. `layout.css`
5. Component CSS (`buttons.css`, `cards.css`, `navigation.css`, `hero.css`, `forms.css`, `accordion.css`, `tabs.css`, `carousel.css`, `pricing.css`, `footer.css`, `utilities.css`)
6. `animations.css`
7. Page-specific CSS (`pages/program.css`, `pages/home.css`, etc.)

---

## JavaScript Architecture

JavaScript is written as **Vanilla ES Modules** (`<script type="module" src="/assets/js/main.js">`).

- Progressive enhancement: All content is 100% visible and accessible if JavaScript is disabled.
- The `html` tag receives class `js` via `<script>document.documentElement.className += ' js';</script>` in `<head>`.
- Scroll reveal animations, tab interactions, accordions, and animated counters initialize automatically on `DOMContentLoaded`.
