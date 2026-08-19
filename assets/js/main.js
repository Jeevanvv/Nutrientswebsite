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
import { initVideoModal } from './video-modal.js';
import { initProgramModal } from './program-modal.js?v=12';

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
  initVideoModal();
  initProgramModal();

  // Before/After Image Comparison Slider
  document.addEventListener('input', (e) => {
    if (e.target && e.target.classList.contains('ba-slider__range')) {
      const slider = e.target.closest('.ba-slider');
      if (!slider) return;
      const val = e.target.value;
      const before = slider.querySelector('.ba-slider__before');
      const handle = slider.querySelector('.ba-slider__handle');
      if (before) before.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
      if (handle) handle.style.left = `${val}%`;
    }
  });

});

