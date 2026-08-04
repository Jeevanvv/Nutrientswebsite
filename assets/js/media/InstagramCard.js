/**
 * InstagramCard.js — Instagram Reel Card Component
 *
 * Supports both:
 * 1. Image Thumbnail Reel Cards with play overlays linking to Instagram
 * 2. Embedded Instagram Reel iframe players
 */

import { Analytics } from './analytics.js';

/**
 * Creates an Instagram Reel card element (supports image thumbnails + embedded live reel player).
 * @param {import('../providers/MediaProvider.js').InstagramPost} item
 * @returns {HTMLElement}
 */
export function createInstagramCard(item) {
  // If item has an embed iframe URL or is marked for live iframe embed:
  if (item.embedUrl) {
    const container = document.createElement('div');
    container.className = 'ig-card ig-card--embed';
    container.innerHTML = `
      <iframe
        class="ig-card__iframe"
        src="${escHtml(item.embedUrl)}"
        width="100%"
        height="380"
        frameborder="0"
        scrolling="no"
        allowtransparency="true"
        allow="encrypted-media"
        title="${escHtml(item.label)}"
      ></iframe>
    `;
    return container;
  }

  // Standard Reel card with real thumbnail image & play overlay:
  const card = document.createElement('a');
  card.className = 'ig-card ig-card--reel';
  card.href      = item.instagramUrl || 'https://www.instagram.com/nutrinestwithmegha/';
  card.target    = '_blank';
  card.rel       = 'noopener noreferrer';
  card.setAttribute('aria-label', `Watch Reel on Instagram: ${item.label}`);

  const thumbUrl = item.thumbnail || '/assets/images/megha-kiran.jpg';

  card.innerHTML = `
    <div class="ig-card__img-wrap">
      <img
        class="ig-card__img"
        src="${escHtml(thumbUrl)}"
        alt="${escHtml(item.label)}"
        loading="lazy"
        decoding="async"
        onerror="this.src='/assets/images/megha-kiran.jpg'"
      />
      <div class="ig-card__overlay">
        <div class="ig-card__play-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v14l11-7-11-7z"/>
          </svg>
        </div>
        <span class="ig-card__badge" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
          Reel
        </span>
      </div>
    </div>
    <div class="ig-card__info">
      <p class="ig-card__handle">@nutrinestwithmegha</p>
      <p class="ig-card__label">${escHtml(item.label)}</p>
      <span class="ig-card__cta-text">Watch on Instagram ↗</span>
    </div>
  `;

  // Analytics
  card.addEventListener('click', () => Analytics.instagramClicked(item.label, card.href));

  return card;
}

/**
 * Creates the "View More on Instagram →" CTA end card.
 * @param {string} profileUrl - Instagram profile URL
 * @returns {HTMLElement}
 */
export function createInstagramCtaCard(profileUrl) {
  const card = document.createElement('a');
  card.className = 'ig-card ig-card--cta';
  card.href      = profileUrl || 'https://www.instagram.com/nutrinestwithmegha/';
  card.target    = '_blank';
  card.rel       = 'noopener noreferrer';
  card.setAttribute('aria-label', 'View profile on Instagram');

  card.innerHTML = `
    <div class="ig-cta__icon" aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
      </svg>
    </div>
    <p class="ig-cta__text">View Profile<br>on Instagram</p>
    <span class="ig-cta__arrow" aria-hidden="true">→</span>
  `;

  card.addEventListener('click', () => Analytics.instagramClicked('View Profile CTA', card.href));
  return card;
}

function escHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
