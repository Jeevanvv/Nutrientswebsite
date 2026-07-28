/**
 * sticky-cta.js — NutriNest Sticky Mobile CTA Bar
 *
 * Shows the #sticky-cta bar after the user scrolls past the first hero
 * section. Hidden by CSS above 860px (desktop only shows in nav).
 */

import { qs } from './utils.js';

export function initStickyCta() {
  const bar  = qs('#sticky-cta');
  const hero = qs('.hero');
  if (!bar || !hero) return;

  let shown = false;

  function check() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    if (heroBottom < 0 && !shown) {
      bar.setAttribute('data-visible', '');
      bar.setAttribute('aria-hidden', 'false');
      shown = true;
    } else if (heroBottom >= 0 && shown) {
      bar.removeAttribute('data-visible');
      bar.setAttribute('aria-hidden', 'true');
      shown = false;
    }
  }

  window.addEventListener('scroll', check, { passive: true });
  check(); // run on load in case page is already scrolled
}
