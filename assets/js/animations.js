/**
 * animations.js — NutriNest Scroll Reveal
 *
 * Adds data-shown to .reveal elements when they enter the viewport.
 * CSS in animations.css handles the actual fade-in / slide-up transition.
 */

import { qsa } from './utils.js';

export function initReveal() {
  const els = qsa('.reveal');
  if (!els.length || !('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    qsa('.reveal').forEach(el => el.setAttribute('data-shown', ''));
    return;
  }

  // Respect user's reduced-motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    els.forEach(el => el.setAttribute('data-shown', ''));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-shown', '');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(el => observer.observe(el));
}
