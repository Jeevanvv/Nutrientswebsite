/**
 * build.js — NutriNest static site builder
 *
 * Usage: node build.js
 *
 * What it does:
 *  1. Reads every .html file under src/
 *  2. Replaces <!-- INCLUDE:header --> with partials/header.html contents
 *  3. Replaces <!-- INCLUDE:footer --> with partials/footer.html contents
 *  4. Sets aria-current="page" on the correct <a> inside the injected nav
 *     based on the output file's root-relative path
 *  5. Writes the result to the matching path at the project root
 *     (e.g. src/programs/womens-health.html → programs/womens-health.html)
 *
 * No npm dependencies — pure Node.js fs/path only.
 * Re-run any time you change a page source or a partial.
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/* ---- paths ---------------------------------------------------------------- */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR      = path.join(__dirname, 'src');
const PARTIALS_DIR = path.join(__dirname, 'partials');
const OUT_DIR      = __dirname; // write built files to project root

/* ---- load partials once --------------------------------------------------- */
const header = fs.readFileSync(path.join(PARTIALS_DIR, 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(PARTIALS_DIR, 'footer.html'), 'utf8');

/* ---- helpers -------------------------------------------------------------- */

/**
 * Walk a directory and yield every .html file path recursively.
 * @param {string} dir
 * @returns {string[]}
 */
function walkHtml(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkHtml(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

/**
 * Given the output file's root-relative URL path (e.g. /programs/womens-health.html),
 * mark the matching <a> in the injected nav with aria-current="page".
 *
 * Strategy: find every <a href="..."> in the header HTML and add
 * aria-current="page" to any whose href exactly matches pagePath.
 *
 * @param {string} html   — full built HTML string
 * @param {string} pagePath — e.g. "/programs/womens-health.html"
 * @returns {string}
 */
function setActiveLink(html, pagePath) {
  const normalized = pagePath === '/index.html' ? '/' : pagePath;

  // Split into header nav and rest of document to only set aria-current inside <nav id="site-nav">
  return html.replace(/<nav\s+class="nav"[^>]*>([\s\S]*?)<\/nav>/i, (navBlock) => {
    return navBlock.replace(
      /<a\s([^>]*href=["']([^"']*)["'][^>]*)>/gi,
      (match, attrs, href) => {
        const matches = href === normalized || (normalized === '/' && href === '/index.html') || href === pagePath;
        if (matches) {
          if (attrs.includes('aria-current')) return match;
          return `<a ${attrs} aria-current="page">`;
        }
        return match.replace(/\s*aria-current="page"/gi, '');
      }
    );
  });
}

/* ---- main ----------------------------------------------------------------- */

let built = 0;
let errors = 0;

const srcFiles = walkHtml(SRC_DIR);

for (const srcFile of srcFiles) {
  try {
    // Derive the root-relative output path
    const relToSrc   = path.relative(SRC_DIR, srcFile);       // e.g. programs/womens-health.html
    const outFile    = path.join(OUT_DIR, relToSrc);           // absolute output path
    const pagePath   = '/' + relToSrc.replace(/\\/g, '/');     // e.g. /programs/womens-health.html

    // Read source
    let html = fs.readFileSync(srcFile, 'utf8');

    // Inject partials
    html = html.replace(/<!--\s*INCLUDE:header\s*-->/gi, header);
    html = html.replace(/<!--\s*INCLUDE:footer\s*-->/gi, footer);

    // Set active nav link
    html = setActiveLink(html, pagePath);

    // Ensure output directory exists
    fs.mkdirSync(path.dirname(outFile), { recursive: true });

    // Write output
    fs.writeFileSync(outFile, html, 'utf8');

    console.log(`  ✓  ${pagePath}`);
    built++;
  } catch (err) {
    console.error(`  ✗  ${srcFile}`);
    console.error(`     ${err.message}`);
    errors++;
  }
}

console.log(`\nBuild complete: ${built} page(s) built, ${errors} error(s).`);
if (errors > 0) process.exit(1);
