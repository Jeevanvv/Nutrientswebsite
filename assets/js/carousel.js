/**
 * carousel.js — NutriNest Testimonial Carousel
 *
 * Wires [data-carousel-nav] navigation buttons to their target carousel
 * scroll container. Scrolls by one card width per click.
 */

import { qsa, qs } from './utils.js';

export function initCarousels() {
  qsa('[data-carousel-nav]').forEach(nav => {
    const targetId = nav.getAttribute('data-carousel-nav');
    const track    = qs(`#${targetId}`);
    if (!track) return;

    const buttons = qsa('button[data-dir]', nav);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const dir       = parseInt(btn.getAttribute('data-dir'), 10); // -1 or 1
        const cardWidth = track.firstElementChild?.offsetWidth ?? 320;
        const gap       = parseInt(getComputedStyle(track).columnGap) || 24;
        track.scrollBy({ left: dir * (cardWidth + gap), behavior: 'smooth' });
      });
    });
  });
}
