/**
 * filters.js — NutriNest Chip Filter & Live Search System
 *
 * Handles:
 *  1. [data-filter-group] legacy category chip sets
 *  2. Modular Recipe Library (rlib): dual-axis filtering (meal category + health condition) & swipeable carousel navigation
 *  3. Search input filtering (#recipe-search or [data-filter-search])
 */

import { qsa, qs } from './utils.js';

export function initFilters() {
  // --- 1. Modular Recipe Library Navigation & Carousel ---
  initRecipeLibrary();

  // --- 2. Legacy Category Chip Filter Groups (if present) ---
  qsa('[data-filter-group]:not([data-rlib-group])').forEach(group => {
    const targetSel = group.getAttribute('data-filter-target');
    const emptySel  = group.getAttribute('data-filter-empty');
    const grid      = qs(targetSel);
    const emptyMsg  = emptySel ? qs(emptySel) : null;
    if (!grid) return;

    const chips       = qsa('.chip--filter', group);
    const items       = qsa('[data-tags]', grid);
    const searchInput = qs('#recipe-search, [data-filter-search]');
    const clearBtn    = qs('.recipe-search__clear');

    function applyFilters() {
      const activeChip = group.querySelector('.chip--filter[aria-pressed="true"]');
      const category   = activeChip ? activeChip.getAttribute('data-value') : 'all';
      const query      = searchInput ? searchInput.value.trim().toLowerCase() : '';

      if (clearBtn) clearBtn.hidden = query.length === 0;

      let visibleCount = 0;

      items.forEach(item => {
        const tags = (item.getAttribute('data-tags') || '').toLowerCase().split(/[\s,]+/).filter(Boolean);
        const matchesCategory = category === 'all' || tags.includes(category);
        let matchesSearch = true;
        if (query) {
          const text = (item.textContent || '').toLowerCase();
          matchesSearch = text.includes(query) || tags.some(t => t.includes(query));
        }

        const show = matchesCategory && matchesSearch;
        if (show) {
          item.style.removeProperty('display');
          item.removeAttribute('hidden');
          item.removeAttribute('data-hidden');
          item.setAttribute('data-shown', '');
          visibleCount++;
        } else {
          item.style.setProperty('display', 'none', 'important');
          item.setAttribute('hidden', '');
          item.setAttribute('data-hidden', '');
          item.removeAttribute('data-shown');
        }
      });

      if (emptyMsg) {
        if (visibleCount === 0) emptyMsg.removeAttribute('hidden');
        else                    emptyMsg.setAttribute('hidden', '');
      }
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          applyFilters();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        applyFilters();
      });
    }
  });
}

/**
 * Modular Recipe Library (rlib) Dual-Axis Filter & Carousel Controller
 */
function initRecipeLibrary() {
  const track = qs('#rlib-track');
  if (!track) return;

  const cards       = qsa('.rlib-card', track);
  const catBtns     = qsa('[data-rlib-group="cat"] [data-cat]');
  const healthBtns  = qsa('[data-rlib-group="health"] [data-health]');
  const searchInput = qs('#recipe-search');
  const clearBtn    = qs('.recipe-search__clear');
  const emptyMsg    = qs('#recipe-empty');
  const prevBtn     = qs('#rlib-prev');
  const nextBtn     = qs('#rlib-next');
  const dotsContainer = qs('#rlib-dots');

  let activeCat    = 'all';
  let activeHealth = 'all';
  let activeQuery  = '';

  function getVisibleCards() {
    return cards.filter(card => !card.hasAttribute('data-hidden'));
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const visibleCards = getVisibleCards();

    if (visibleCards.length <= 1) {
      dotsContainer.style.display = 'none';
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }
    dotsContainer.style.display = 'flex';

    // Calculate current visible card index based on scrollLeft
    const trackRect = track.getBoundingClientRect();
    let activeIdx = 0;
    let minDistance = Infinity;

    visibleCards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const dist = Math.abs(cardRect.left - trackRect.left - 24);
      if (dist < minDistance) {
        minDistance = dist;
        activeIdx = idx;
      }
    });

    visibleCards.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = `rlib-dot${idx === activeIdx ? ' is-active' : ''}`;
      dotsContainer.appendChild(dot);
    });

    if (prevBtn) prevBtn.disabled = activeIdx === 0;
    if (nextBtn) nextBtn.disabled = activeIdx === visibleCards.length - 1;
  }

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase().split(/[\s,]+/).filter(Boolean);
      const matchesCat    = activeCat === 'all' || tags.includes(activeCat);
      const matchesHealth = activeHealth === 'all' || tags.includes(activeHealth);

      let matchesSearch = true;
      if (activeQuery) {
        const text = (card.textContent || '').toLowerCase();
        matchesSearch = text.includes(activeQuery) || tags.some(t => t.includes(activeQuery));
      }

      const show = matchesCat && matchesHealth && matchesSearch;

      if (show) {
        card.removeAttribute('data-hidden');
        card.style.display = '';
        visibleCount++;
      } else {
        card.setAttribute('data-hidden', 'true');
        card.style.display = 'none';
      }
    });

    if (emptyMsg) {
      if (visibleCount === 0) emptyMsg.removeAttribute('hidden');
      else                    emptyMsg.setAttribute('hidden', '');
    }

    track.scrollTo({ left: 0, behavior: 'smooth' });
    updateDots();
  }

  // --- Category Pills Listener ---
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('rlib-pill--active'));
      btn.classList.add('rlib-pill--active');
      activeCat = btn.getAttribute('data-cat') || 'all';
      applyFilters();
    });
  });

  // --- Health Filter Chips Listener ---
  healthBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      healthBtns.forEach(b => b.classList.remove('rlib-chip--active'));
      btn.classList.add('rlib-chip--active');
      activeHealth = btn.getAttribute('data-health') || 'all';
      applyFilters();
    });
  });

  // --- Live Search Listeners ---
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      activeQuery = searchInput.value.trim().toLowerCase();
      if (clearBtn) clearBtn.hidden = activeQuery.length === 0;
      applyFilters();
    });

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        activeQuery = '';
        if (clearBtn) clearBtn.hidden = true;
        applyFilters();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      activeQuery = '';
      clearBtn.hidden = true;
      applyFilters();
    });
  }

  // --- Carousel Navigation Buttons ---
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const visibleCards = getVisibleCards();
      if (visibleCards.length === 0) return;
      const cardWidth = visibleCards[0].offsetWidth + 14;
      track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const visibleCards = getVisibleCards();
      if (visibleCards.length === 0) return;
      const cardWidth = visibleCards[0].offsetWidth + 14;
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }

  // Update dots on scroll
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateDots, 60);
  }, { passive: true });

  // Initial dots setup
  updateDots();
}
