/**
 * tabs.js — NutriNest Tab System
 *
 * Finds all [data-tabs] containers and wires:
 *  - Click to switch tab panels
 *  - Keyboard navigation: ArrowLeft / ArrowRight / Home / End
 *  - ARIA: aria-selected on tabs, hidden on panels
 */

import { qsa } from './utils.js';

/**
 * @param {Document|Element} ctx
 */
export function initTabs(ctx = document) {
  qsa('[data-tabs]', ctx).forEach(container => {
    const tablist = container.querySelector('[role="tablist"]');
    if (!tablist) return;

    const tabs   = qsa('[role="tab"]', tablist);
    const panels = qsa('[role="tabpanel"]', container);

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activateTab(i));
      tab.addEventListener('keydown', (e) => handleKey(e, i));
    });

    function activateTab(index) {
      tabs.forEach((t, i) => {
        const isSelected = i === index;
        t.setAttribute('aria-selected', isSelected);
        t.setAttribute('tabindex', isSelected ? '0' : '-1');
      });
      panels.forEach((p, i) => {
        if (i === index) p.removeAttribute('hidden');
        else             p.setAttribute('hidden', '');
      });
    }

    function handleKey(e, current) {
      const count = tabs.length;
      let next = current;
      if (e.key === 'ArrowRight') next = (current + 1) % count;
      else if (e.key === 'ArrowLeft') next = (current - 1 + count) % count;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End')  next = count - 1;
      else return;

      e.preventDefault();
      activateTab(next);
      tabs[next].focus();
    }

    // Ensure initial state is consistent
    const selectedIndex = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    activateTab(selectedIndex >= 0 ? selectedIndex : 0);
  });
}
