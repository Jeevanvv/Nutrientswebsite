/**
 * MediaCarousel.js — Reusable Media Carousel Component
 *
 * Powers all three carousels (Learn with Megha, Transformation Stories, Instagram)
 * with identical scrolling behavior, snap, arrow nav, keyboard nav, and lazy loading.
 *
 * Architecture:
 *  - MediaCarousel handles: scrolling, rendering, navigation, interactions
 *  - Card factories (VideoCard, TransformationCard, InstagramCard) handle: presentation
 *  - MediaCarousel never knows where data comes from or what cards look like
 *
 * Usage:
 *   new MediaCarousel({
 *     track:       document.getElementById('learn-track'),
 *     items:       learnVideos,          // any array, any size — no limits
 *     cardFactory: createVideoCard,      // (item) => HTMLElement
 *     prevBtn:     document.getElementById('learn-prev'),  // optional
 *     nextBtn:     document.getElementById('learn-next'),  // optional
 *     sectionEl:   document.getElementById('learn-with-megha'), // for IntersectionObserver
 *   });
 */

export class MediaCarousel {
  /**
   * @param {Object}          config
   * @param {HTMLElement}     config.track        - Flex scroll container
   * @param {Array}           config.items        - Data items (any length, any type)
   * @param {Function}        config.cardFactory  - (item) => HTMLElement
   * @param {HTMLElement}     [config.prevBtn]    - Previous arrow button
   * @param {HTMLElement}     [config.nextBtn]    - Next arrow button
   * @param {HTMLElement}     [config.sectionEl]  - Section wrapper for IntersectionObserver
   * @param {string}          [config.ariaLabel]  - aria-label for the track
   */
  constructor({
    track,
    items,
    cardFactory,
    prevBtn    = null,
    nextBtn    = null,
    sectionEl  = null,
    ariaLabel  = 'Media carousel',
  }) {
    if (!track) return;

    this.track       = track;
    this.items       = items;
    this.cardFactory = cardFactory;
    this.prevBtn     = prevBtn;
    this.nextBtn     = nextBtn;
    this.sectionEl   = sectionEl;
    this._rendered   = false;

    track.setAttribute('role', 'list');
    track.setAttribute('aria-label', ariaLabel);

    // Render skeleton placeholders immediately to prevent layout shift
    this.#renderSkeletons();

    // Only populate real cards when section enters viewport
    this.#initLazyRender();

    if (prevBtn || nextBtn) {
      this.#initArrowNav();
    }

    this.#initKeyboardNav();
  }

  // ---- Private: skeleton placeholders ------------------------------------------

  /**
   * Inserts skeleton cards matching final card dimensions immediately.
   * This prevents layout shift when real cards load.
   */
  #renderSkeletons() {
    const count = Math.max(this.items.length, 1);
    const isIg  = this.track.id?.includes('ig');

    for (let i = 0; i < count; i++) {
      const li = document.createElement('li');
      li.setAttribute('role', 'listitem');
      li.setAttribute('aria-hidden', 'true');
      li.className = isIg ? 'ig-card ig-card--skeleton' : 'vc-card vc-card--skeleton';

      if (!isIg) {
        li.innerHTML = `
          <div class="vc-card__thumb-wrap">
            <div class="vc-skeleton" style="width:100%;height:100%;border-radius:0"></div>
          </div>
          <div class="vc-card__meta">
            <div class="vc-skeleton" style="height:14px;width:80%;border-radius:6px;margin-bottom:8px"></div>
            <div class="vc-skeleton" style="height:12px;width:55%;border-radius:6px"></div>
          </div>
        `;
      } else {
        li.innerHTML = `<div class="ig-skeleton" style="width:100%;height:100%;border-radius:0"></div>`;
      }

      this.track.appendChild(li);
    }
  }

  // ---- Private: lazy render with IntersectionObserver --------------------------

  #initLazyRender() {
    const target = this.sectionEl || this.track;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this._rendered) {
          this._rendered = true;
          observer.disconnect();
          this.#renderCards(prefersReduced);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(target);
  }

  /**
   * Clears skeletons and renders real card elements.
   * @param {boolean} prefersReduced
   */
  #renderCards(prefersReduced) {
    // Clear skeleton placeholders
    this.track.innerHTML = '';

    if (this.items.length === 0) {
      this.#renderEmptyState();
      return;
    }

    this.items.forEach((item, i) => {
      let cardEl;
      try {
        // If item is already an HTMLElement (e.g. pre-built Instagram CTA card)
        cardEl = item instanceof HTMLElement ? item : this.cardFactory(item);
      } catch (err) {
        console.warn('[MediaCarousel] Card factory error:', err);
        cardEl = this.#createErrorCard();
      }

      const li = document.createElement('li');
      li.setAttribute('role', 'listitem');

      // Stagger fade-in (disabled for prefers-reduced-motion)
      if (!prefersReduced) {
        li.style.animationDelay = `${i * 60}ms`;
        li.classList.add('mc-item--fadein');
      }

      li.appendChild(cardEl);
      this.track.appendChild(li);
    });

    this.#updateArrowState();
  }

  // ---- Private: empty state ----------------------------------------------------

  #renderEmptyState() {
    const li = document.createElement('li');
    li.setAttribute('role', 'listitem');
    li.className = 'mc-empty';
    li.innerHTML = `
      <div class="mc-empty__inner">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>Content coming soon</p>
      </div>
    `;
    this.track.appendChild(li);
  }

  // ---- Private: error card (shown when cardFactory throws) ---------------------

  #createErrorCard() {
    const div = document.createElement('div');
    div.className = 'vc-card vc-card--error';
    div.setAttribute('aria-label', 'Content unavailable');
    div.innerHTML = `
      <div class="vc-card__thumb-wrap">
        <div class="vc-error-placeholder" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Video unavailable</span>
        </div>
      </div>
    `;
    return div;
  }

  // ---- Private: arrow navigation -----------------------------------------------

  #initArrowNav() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.#scrollBy(-1));
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.#scrollBy(1));
    }

    // Update arrow disabled state on scroll
    this.track.addEventListener('scroll', () => this.#updateArrowState(), { passive: true });
    this.#updateArrowState();
  }

  #scrollBy(direction) {
    const cardWidth = this.track.firstElementChild?.offsetWidth || 300;
    const gap       = 16;
    this.track.scrollBy({
      left:     direction * (cardWidth + gap),
      behavior: 'smooth',
    });
  }

  #updateArrowState() {
    if (!this.prevBtn && !this.nextBtn) return;
    const { scrollLeft, scrollWidth, clientWidth } = this.track;
    if (this.prevBtn) this.prevBtn.disabled = scrollLeft <= 4;
    if (this.nextBtn) this.nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 4;
  }

  // ---- Private: keyboard navigation -------------------------------------------

  #initKeyboardNav() {
    this.track.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); this.#scrollBy(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); this.#scrollBy(1);  }
    });
  }
}
