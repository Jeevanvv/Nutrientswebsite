# NutriNest Component Library Reference

This document lists all reusable UI components in NutriNest, their HTML structures, associated CSS classes, and interaction behaviors.

---

## 1. Hero (`assets/css/hero.css`)

### Standard Centred Hero
```html
<section class="hero hero--center">
  <div class="hero__pattern" aria-hidden="true"></div>
  <div class="wrap hero__inner">
    <p class="hero__breadcrumb"><a href="/index.html">Home</a> › Section</p>
    <p class="eyebrow">Category</p>
    <h1>Page Title</h1>
    <p class="lead">Lead summary paragraph.</p>
    <div class="btn-row mt4">
      <a class="btn btn--primary" href="/contact.html">Action</a>
    </div>
  </div>
</section>
```

---

## 2. Buttons (`assets/css/buttons.css`)

- `.btn` — Base button primitive
- `.btn--primary` — Leaf Green background with Dark Green text
- `.btn--ghost` — Outlined button with transparent background
- `.btn--text` — Text link with underline rule
- `.btn-row` — Flex wrapper for button groups

```html
<div class="btn-row">
  <a class="btn btn--primary" href="/contact.html">Primary Action</a>
  <a class="btn btn--ghost" href="#details">Ghost Action</a>
</div>
```

---

## 3. Cards & Grids (`assets/css/cards.css`)

- `.grid.g3` — 3-column responsive grid (collapses to 1-column on mobile)
- `.card` — Elevated white card with hover lift
- `.card--flat` — Card without hover lift
- `.prog-card` — Program directory card with "Read more →" link

```html
<div class="grid g3">
  <article class="card">
    <span class="card__label">Label</span>
    <h3>Card Title</h3>
    <p>Card description text.</p>
  </article>
</div>
```

---

## 4. Accordions (`assets/css/accordion.css` & `assets/js/accordion.js`)

Used for FAQs and expandable content sections.

```html
<div class="accordion">
  <div class="acc-item">
    <h3 style="margin:0">
      <button class="acc-btn" id="faq-b1" aria-expanded="false" aria-controls="faq-p1">
        <span>Question Title?</span>
        <span class="acc-btn__icon" aria-hidden="true"></span>
      </button>
    </h3>
    <div class="acc-panel" id="faq-p1" role="region" aria-labelledby="faq-b1">
      <p>Answer content goes here.</p>
    </div>
  </div>
</div>
```

---

## 5. Tabs (`assets/css/tabs.css` & `assets/js/tabs.js`)

Used for switching between age groups, delivery models, or filter categories.

```html
<div data-tabs>
  <div class="tabs" role="tablist">
    <button class="tab" role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="panel-2" tabindex="-1">Tab 2</button>
  </div>
  <div id="panel-1" role="tabpanel">Content 1</div>
  <div id="panel-2" role="tabpanel" hidden>Content 2</div>
</div>
```

---

## 6. Process Steps (`assets/css/cards.css`)

10-stage NutriNest methodology list.

```html
<div class="steps">
  <article class="step">
    <div class="step__num">01</div>
    <div>
      <h3>Assessment</h3>
      <p>Step description text.</p>
    </div>
  </article>
</div>
```

---

## 7. Chip Filters (`assets/css/utilities.css` & `assets/js/filters.js`)

Used in Recipe Library and Courses pages for category filtering.

```html
<div data-filter-group data-filter-target="#grid-id" data-filter-empty="#empty-id">
  <button class="chip chip--filter" data-value="all" aria-pressed="true">All</button>
  <button class="chip chip--filter" data-value="pcos" aria-pressed="false">PCOS</button>
</div>
```

---

## 8. Pricing Cards (`assets/css/pricing.css`)

```html
<div class="price-cards">
  <article class="price">
    <h3>Standard</h3>
    <p class="price__amount">₹18,000</p>
    <p class="price__meta">3 months</p>
    <ul class="price__list">
      <li>Feature 1</li>
    </ul>
    <a class="btn btn--ghost" href="/contact.html">Select</a>
  </article>
  <article class="price price--featured">
    <span class="price__flag">Best Value</span>
    <h3>Featured</h3>
    <p class="price__amount">₹24,000</p>
    <p class="price__meta">6 months</p>
    <ul class="price__list">
      <li>Feature 1</li>
    </ul>
    <a class="btn btn--primary" href="/contact.html">Select</a>
  </article>
</div>
```
