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

  /* ---- Bottom Tab Bar Active Highlighting ------------------------------- */
  setActiveTab(window.location.pathname);
}

function setActiveTab(path) {
  const tabs = qsa('.tab-item');
  if (!tabs.length) return;

  const normPath = (path === '/index.html' || path === '/') ? '/' : path;
  let matched = false;

  tabs.forEach(tab => {
    const matchVal = tab.dataset.tabMatch || '';
    tab.removeAttribute('aria-current');

    if (matched) return;
    if (matchVal.startsWith('__')) return;

    if (matchVal === '/') {
      if (normPath === '/') {
        tab.setAttribute('aria-current', 'page');
        matched = true;
      }
    } else if (normPath === matchVal || normPath.startsWith(matchVal)) {
      tab.setAttribute('aria-current', 'page');
      matched = true;
    }
  });

  if (!matched || window.location.hash === '#corporates') {
    const corporatesTab = qs('#tab-corporates');
    if (corporatesTab && window.location.hash === '#corporates') {
      tabs.forEach(t => t.removeAttribute('aria-current'));
      corporatesTab.setAttribute('aria-current', 'page');
    }
  }

  const individualsTab = qs('#tab-individuals');
  if (
    individualsTab &&
    normPath.startsWith('/programs/') &&
    window.location.hash === '#individuals'
  ) {
    tabs.forEach(t => t.removeAttribute('aria-current'));
    individualsTab.setAttribute('aria-current', 'page');
  }
}
