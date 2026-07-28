/**
 * main.js — NutriNest Application Entry Point
 *
 * Imports and initialises all modules on DOMContentLoaded.
 * Loaded as <script type="module"> from partials/footer.html.
 */

import { initNavbar }    from './navbar.js';
import { initAccordions } from './accordion.js';
import { initTabs }      from './tabs.js';
import { initCarousels } from './carousel.js';
import { initCounters }  from './counters.js';
import { initReveal }    from './animations.js';
import { initFilters }   from './filters.js';
import { initForms }     from './forms.js';
import { initStickyCta } from './sticky-cta.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAccordions(document);
  initTabs(document);
  initCarousels();
  initCounters();
  initReveal();
  initFilters();
  initForms();
  initStickyCta();
});
