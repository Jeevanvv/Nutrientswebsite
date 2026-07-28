/**
 * counters.js — NutriNest Animated Number Counters
 *
 * Finds all .stat__value and .impact__value elements whose text is
 * numeric (or ends with + / %). When they enter the viewport, counts
 * up from 0 to their target value over ~1.2 s.
 */

import { qsa } from './utils.js';

export function initCounters() {
  const els = qsa('.stat__value, .impact__value');
  if (!els.length || !('IntersectionObserver' in window)) return;

  const NUM_RE = /^([^0-9]*)([0-9,]+)(.*?)$/;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      animateCount(entry.target);
    });
  }, { threshold: 0.5 });

  els.forEach(el => {
    const m = el.textContent.trim().match(NUM_RE);
    if (m) observer.observe(el);
  });

  function animateCount(el) {
    const m      = el.textContent.trim().match(NUM_RE);
    if (!m) return;
    const prefix = m[1];
    const target = parseInt(m[2].replace(/,/g, ''), 10);
    const suffix = m[3];
    const dur    = 1200; // ms
    const start  = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }
}
