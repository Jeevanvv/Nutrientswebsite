/**
 * filters.js — NutriNest Chip Filter System
 *
 * Handles [data-filter-group] chip sets. Clicking a chip filters the items
 * in [data-filter-target] by their data-tags attribute.
 *
 * HTML pattern:
 *  <div data-filter-group data-filter-target="#my-grid" data-filter-empty="#my-empty">
 *    <button class="chip chip--filter" data-value="all">All</button>
 *    <button class="chip chip--filter" data-value="pcos">PCOS</button>
 *  </div>
 *  <div id="my-grid">
 *    <article data-tags="pcos">...</article>
 *  </div>
 *  <p id="my-empty" hidden>No results.</p>
 */

import { qsa, qs } from './utils.js';

export function initFilters() {
  qsa('[data-filter-group]').forEach(group => {
    const targetSel = group.getAttribute('data-filter-target');
    const emptySel  = group.getAttribute('data-filter-empty');
    const grid      = qs(targetSel);
    const emptyMsg  = emptySel ? qs(emptySel) : null;
    if (!grid) return;

    const chips = qsa('.chip--filter', group);
    const items = qsa('[data-tags]', grid);

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Update active chip
        chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');

        const value = chip.getAttribute('data-value');

        let visibleCount = 0;
        items.forEach(item => {
          const tags = (item.getAttribute('data-tags') || '').split(',').map(t => t.trim());
          const show = value === 'all' || tags.includes(value);
          item.style.display = show ? '' : 'none';
          if (show) visibleCount++;
        });

        if (emptyMsg) {
          if (visibleCount === 0) emptyMsg.removeAttribute('hidden');
          else                    emptyMsg.setAttribute('hidden', '');
        }
      });
    });
  });
}
