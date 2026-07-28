# Guide: Adding a New Program Page (< 10 Minutes)

This step-by-step workflow allows developers or AI coding assistants to add a new program page to NutriNest in under 10 minutes.

---

## Step 1: Copy the Template

Copy `templates/program-template.html` into `src/programs/[program-slug].html`.

Example:
```bash
cp templates/program-template.html src/programs/diabetes-reversal.html
```

---

## Step 2: Customize Content

Open `src/programs/[program-slug].html` and replace the placeholder bracketed text:

1. Update `<title>` and `<meta name="description">`.
2. Update the Hero section:
   - Breadcrumb: `<a href="/programs/index.html">Programs</a> › Diabetes Reversal`
   - Category Eyebrow: `For individuals` (or `For corporates`)
   - `<h1>`: Diabetes Reversal Program
   - Lead paragraph & trust points.
3. Update the Overview split section.
4. Update the "Who is it for" 3-column grid (`.grid.g3`).
5. Update the "Problems we solve" checklist (`.checklist`).
6. Update the 10-step process descriptions.
7. Update the "What's included" grid.
8. Update the FAQ accordion (ensure `id` and `aria-controls` match).

---

## Step 3: Add to Header Mega-Menu

Open `partials/header.html` and add a link under the appropriate column:

```html
<li><a href="/programs/diabetes-reversal.html">Diabetes Reversal Program</a></li>
```

---

## Step 4: Add to Programs Directory (`src/programs/index.html`)

Add a program card inside the relevant grid in `src/programs/index.html`:

```html
<a class="card prog-card reveal" href="/programs/diabetes-reversal.html">
  <span class="card__label">For individuals</span>
  <h3>Diabetes Reversal Program</h3>
  <p>Evidence-based glycemic control and insulin sensitivity optimization.</p>
  <span class="go">Read more →</span>
</a>
```

---

## Step 5: Add to Footer & Sitemap

1. Open `partials/footer.html` and add the link under the Programs column.
2. Open `sitemap.xml` and add:
   ```xml
   <url>
     <loc>https://nutrinest.in/programs/diabetes-reversal.html</loc>
     <changefreq>monthly</changefreq>
     <priority>0.8</priority>
   </url>
   ```

---

## Step 6: Build & Verify

Run the build script:

```bash
node build.js
```

Verify that `/programs/diabetes-reversal.html` was generated in the root directory with 0 errors and active navigation links set.
