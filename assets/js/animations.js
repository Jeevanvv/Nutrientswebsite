/**
 * animations.js — NutriNest Scroll Reveal
 *
 * Adds data-shown to .reveal, .reveal-img, and .reveal-fade elements
 * when they enter the viewport. CSS in animations.css handles the actual
 * transitions. Stagger indexes (--i) are injected on child cards/steps.
 *
 * Intentionally excludes .marquee elements — they have their own @keyframes
 * animation and must not be part of the scroll-reveal system.
 */

import { qsa } from './utils.js';

export function initReveal() {
  // Exclude .marquee — it has its own animation system
  const els = Array.from(qsa('.reveal, .reveal-img, .reveal-fade'))
    .filter(el => !el.classList.contains('marquee'));

  if (!els.length || !('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    els.forEach(el => el.setAttribute('data-shown', ''));
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
      if (!entry.isIntersecting) return;

      const el = entry.target;
      observer.unobserve(el);

      // Small delay so the animation is visible during scroll, not during
      // the initial viewport scan that fires before the user has moved.
      setTimeout(() => {
        // Inject stagger indexes on direct card/step/stat/li children
        el.querySelectorAll(':scope > .card, :scope > .step, :scope > .stat, :scope > li')
          .forEach((child, i) => child.style.setProperty('--i', i));

        el.setAttribute('data-shown', '');
      }, 80);
    });
  }, {
    threshold: 0.1,
    // Negative bottom margin: element must be at least 60px inside the viewport
    // before triggering. This prevents firing during initial page load scan
    // for elements just at the viewport edge, especially on mobile.
    rootMargin: '0px 0px -60px 0px'
  });

  els.forEach(el => observer.observe(el));
}
