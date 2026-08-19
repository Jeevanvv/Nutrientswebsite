/**
 * accordion.js — NutriNest Accordion Engine
 *
 * Handles both FAQ Accordions (.accordion) and Card Accordions (.card-acc-group).
 * Closes sibling items when one opens (single-expand behavior).
 * Fully ARIA-compliant: aria-expanded on button, role="region" on panel.
 * Panels animate open/closed via maxHeight for smooth motion.
 */

import { qsa } from './utils.js';

/**
 * Smoothly expand a panel to its natural scroll height.
 * @param {HTMLElement} panel
 */
function openPanel(panel) {
  panel.setAttribute('data-open', '');
  panel.style.maxHeight = panel.scrollHeight + 'px';
}

/**
 * Smoothly collapse a panel back to 0.
 * @param {HTMLElement} panel
 */
function closePanel(panel) {
  panel.removeAttribute('data-open');
  panel.style.maxHeight = '0';
}

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

      // Initialise state — set maxHeight to match initial aria-expanded
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        panel.setAttribute('data-open', '');
        // Use a natural height on init so the panel isn't clipped
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.removeAttribute('data-open');
        panel.style.maxHeight = '0';
      }

      btn.addEventListener('click', () => {
        const expanding = btn.getAttribute('aria-expanded') !== 'true';

        // Close all in this accordion
        buttons.forEach(b => {
          b.setAttribute('aria-expanded', 'false');
          const p = document.getElementById(b.getAttribute('aria-controls'));
          if (p) closePanel(p);
        });

        // Open the clicked one
        if (expanding) {
          btn.setAttribute('aria-expanded', 'true');
          if (panel) openPanel(panel);
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
