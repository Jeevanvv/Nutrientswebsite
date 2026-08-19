/**
 * navbar.js — NutriNest Navigation, Mobile Sidebar Drawer & Bottom Tab Bar
 *
 * Handles:
 *  - Mobile sidebar drawer toggle (#nav-toggle, #drawer-close, #drawer-backdrop)
 *  - Body class toggle (.drawer-open) to fix stacking context for backdrop
 *  - Programs dropdown accordion (.nav__btn)
 *  - Lock body scroll when mobile drawer is open
 *  - Active tab highlighting on bottom navigation bar
 */

import { qs, qsa, on } from './utils.js';

export function initNavbar() {
  const toggle   = qs('#nav-toggle');
  const nav      = qs('#site-nav');
  const backdrop = qs('#drawer-backdrop');
  const closeBtn = qs('#drawer-close');
  const header   = qs('.site-header');

  /* ---- Scroll shadow: add .is-scrolled when past 40px ------------------- */
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set correct class on initial load if already scrolled
  }

  const iconMenu  = toggle ? qs('.icon-menu', toggle) : null;
  const iconClose = toggle ? qs('.icon-close', toggle) : null;

  /* ---- Open Drawer -------------------------------------------------------- */
  function openDrawer() {
    if (!nav) return;
    nav.classList.add('is-open');
    document.body.classList.add('drawer-open');
    if (backdrop) backdrop.classList.add('is-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      if (iconMenu)  iconMenu.style.display  = 'none';
      if (iconClose) iconClose.style.display = 'block';
    }
    document.body.style.overflow = 'hidden';
  }

  /* ---- Close Drawer ------------------------------------------------------- */
  function closeDrawer() {
    if (!nav) return;
    nav.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
    if (backdrop) backdrop.classList.remove('is-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      if (iconMenu)  iconMenu.style.display  = 'block';
      if (iconClose) iconClose.style.display = 'none';
    }
    document.body.style.overflow = '';
    closeAllMenus();
  }

  /* ---- Toggle drawer via hamburger button --------------------------------- */
  if (toggle && nav) {
    on(toggle, 'click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.contains('is-open');
      if (isOpen) closeDrawer();
      else        openDrawer();
    });
  }

  /* ---- Close button inside drawer ---------------------------------------- */
  if (closeBtn) {
    on(closeBtn, 'click', closeDrawer);
  }

  /* ---- Backdrop click closes drawer --------------------------------------- */
  if (backdrop) {
    on(backdrop, 'click', closeDrawer);
  }

  /* ---- Mega-menu / Accordion buttons (Programs) -------------------------- */
  qsa('.nav__btn').forEach(btn => {
    const menuId = btn.getAttribute('aria-controls');
    const menu   = qs(`#${menuId}`);
    if (!menu) return;

    on(btn, 'click', (e) => {
      e.stopPropagation();
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      
      if (window.innerWidth > 860) {
        closeAllMenus();
      }

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('hidden', '');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        menu.removeAttribute('hidden');
      }
    });
  });

  /* ---- Close menus on click outside (desktop) ---------------------------- */
  on(document, 'click', (e) => {
    if (window.innerWidth > 860) {
      closeAllMenus();
    }
  });

  /* ---- Close drawer on link click inside drawer ------------------- */
  if (nav) {
    qsa('a', nav).forEach(link => {
      on(link, 'click', () => {
        if (window.innerWidth <= 860) {
          closeDrawer();
        }
      });
    });
  }

  /* ---- Escape key closes drawer and dropdowns ---------------------------- */
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMenus();
      if (nav && nav.classList.contains('is-open')) {
        closeDrawer();
      }
    }
  });

  function closeAllMenus() {
    qsa('.nav__btn').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      const menuId = btn.getAttribute('aria-controls');
      const menu   = qs(`#${menuId}`);
      if (menu) menu.setAttribute('hidden', '');
    });
  }

  /* ---- Bottom Tab Bar Active Highlighting & Sliding Indicator ------------ */
  const updateTabs = () => setActiveTab(window.location.pathname, window.location.hash);
  updateTabs();
  window.addEventListener('hashchange', updateTabs);
  window.addEventListener('popstate', updateTabs);

  // Click handler for instant smooth tab slide & navigation
  qsa('.tab-item').forEach(tab => {
    on(tab, 'click', () => {
      const href = tab.getAttribute('href') || '';
      if (href.includes('#')) {
        const hash = href.substring(href.indexOf('#'));
        setActiveTab(window.location.pathname, hash);
      } else {
        setActiveTab(href, '');
      }
    });
  });
}

export function setActiveTab(path = window.location.pathname, hash = window.location.hash) {
  const tabs = qsa('.tab-item');
  const indicator = qs('#tab-indicator');
  if (!tabs.length) return;

  const p = (path || '').toLowerCase();
  const h = (hash || '').toLowerCase();

  // Strict priority ordering — first match wins, no double-matching
  let activeIndex = 0; // default: Home

  if (h === '#corporates' ||
      p.includes('/corporate.html') ||
      p.includes('/programs/corporate') ||
      p.includes('/programs/b2b') ||
      p.includes('/programs/institution') ||
      p.includes('/programs/community-wellness') ||
      p.includes('/programs/ngo')) {
    activeIndex = 2; // Corporates
  } else if (h === '#individuals' ||
      p.includes('/programs/one-on-one') ||
      p.includes('/programs/womens') ||
      p.includes('/programs/child') ||
      p.includes('/programs/preventive') ||
      p.includes('/programs/group') ||
      p.includes('/programs/membership') ||
      p.includes('/programs/sports') ||
      p.includes('/programs/special') ||
      (p.includes('/programs/') && !h.includes('corporate'))) {
    activeIndex = 1; // Individuals (programs/ catch-all, only if not corporate)
  } else if (p.includes('/about.html') || p.includes('/testimonials')) {
    activeIndex = 4; // Why us
  } else if (p.includes('/resources/')) {
    activeIndex = 3; // Resources
  }
  // else activeIndex stays 0 (Home)

  // Clear all active states, set exactly one
  tabs.forEach(tab => tab.removeAttribute('aria-current'));
  if (tabs[activeIndex]) {
    tabs[activeIndex].setAttribute('aria-current', 'page');
  }

  // Slide dark green pill indicator — fixed position, no flickering
  if (indicator && tabs[activeIndex]) {
    indicator.style.opacity = '1';
    indicator.style.transform = `translateX(${activeIndex * 100}%)`;
  }
}

