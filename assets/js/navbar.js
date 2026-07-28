/**
 * navbar.js — NutriNest Navigation & Mobile Sidebar Drawer
 *
 * Handles:
 *  - Mobile sidebar drawer open/close (#nav-toggle, #drawer-close, #drawer-backdrop)
 *  - Programs dropdown accordion (.nav__btn)
 *  - Outside-click & Escape key dismissal
 *  - Lock body scroll when mobile drawer is open
 */

import { qs, qsa, on } from './utils.js';

export function initNavbar() {
  const toggle   = qs('#nav-toggle');
  const nav      = qs('#site-nav');
  const backdrop = qs('#drawer-backdrop');
  const closeBtn = qs('#drawer-close');
  if (!nav) return;

  const iconMenu  = qs('.icon-menu', toggle);
  const iconClose = qs('.icon-close', toggle);

  /* ---- Open Drawer -------------------------------------------------------- */
  function openDrawer() {
    nav.classList.add('is-open');
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
    nav.classList.remove('is-open');
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
  if (toggle) {
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
      
      // On desktop, close sibling menus first
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

  /* ---- Close drawer & menus on link click inside drawer ------------------- */
  qsa('a', nav).forEach(link => {
    on(link, 'click', () => {
      if (window.innerWidth <= 860) {
        closeDrawer();
      }
    });
  });

  /* ---- Escape key closes drawer and dropdowns ---------------------------- */
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMenus();
      if (nav.classList.contains('is-open')) {
        closeDrawer();
      }
    }
  });

  /* ---- Helpers ------------------------------------------------------------ */
  function closeAllMenus() {
    qsa('.nav__btn').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      const menuId = btn.getAttribute('aria-controls');
      const menu   = qs(`#${menuId}`);
      if (menu) menu.setAttribute('hidden', '');
    });
  }
}
