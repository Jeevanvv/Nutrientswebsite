/**
 * utils.js — NutriNest Shared Utilities
 * Lightweight helpers imported by all other modules.
 */

/** Query one element */
export const qs  = (sel, ctx = document) => ctx.querySelector(sel);

/** Query all elements, returned as Array */
export const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Add event listener (null-safe) */
export const on  = (el, ev, fn, opts) => el?.addEventListener(ev, fn, opts);

/**
 * Debounce a function.
 * @param {Function} fn
 * @param {number} ms
 */
export function debounce(fn, ms = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Generate a unique DOM id (used when one needs to be created programmatically).
 * @param {string} prefix
 */
export function uid(prefix = 'nn') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
