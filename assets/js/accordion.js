/**
 * accordion.js — NutriNest Accordion Engine
 *
 * Handles both FAQ Accordions (.accordion) and Card Accordions (.card-acc-group).
 * Closes sibling items when one opens (single-expand behavior).
 * Fully ARIA-compliant: aria-expanded on button, role="region" on panel.
 */

import { qsa } from './utils.js';

/**
 * @param {Document|Element} ctx — root to search within (default: whole document)
 */
export function initAccordions(ctx = document) {
  // 1. FAQ / Section Accordions
  qsa('.accordion', ctx).forEach(accordion => {
    const buttons = qsa('.acc-btn', accordion);

    buttons.forEach(btn => {
      const panelId = btn.getAttribute('aria-controls');
      const panel   = document.getElementById(panelId);
      if (!panel) return;

      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) panel.setAttribute('data-open', '');
      else        panel.removeAttribute('data-open');

      btn.addEventListener('click', () => {
        const expanding = btn.getAttribute('aria-expanded') !== 'true';

        // Close all in this accordion
        buttons.forEach(b => {
          b.setAttribute('aria-expanded', 'false');
          const p = document.getElementById(b.getAttribute('aria-controls'));
          if (p) p.removeAttribute('data-open');
        });

        // Open the clicked one
        if (expanding) {
          btn.setAttribute('aria-expanded', 'true');
          if (panel) panel.setAttribute('data-open', '');
        }
      });
    });
  });

  // 2. Expandable Program Cards Accordion (.card-acc-group)
  qsa('.card-acc-group', ctx).forEach(group => {
    const buttons = qsa('.card-acc__btn', group);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const expanding = btn.getAttribute('aria-expanded') !== 'true';
        const panelId = btn.getAttribute('aria-controls');
        const panel   = document.getElementById(panelId);

        // Single-expand: collapse all other open cards in this group
        buttons.forEach(b => {
          b.setAttribute('aria-expanded', 'false');
          const p = document.getElementById(b.getAttribute('aria-controls'));
          if (p) p.hidden = true;
        });

        // Expand clicked card if it was collapsed
        if (expanding) {
          btn.setAttribute('aria-expanded', 'true');
          if (panel) panel.hidden = false;
        }
      });
    });
  });
}
