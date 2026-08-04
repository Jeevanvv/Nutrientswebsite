/**
 * VideoCard.js — YouTube Educational Video Card Component
 *
 * Pure factory function: receives a VideoEntry object, returns an HTMLElement.
 * Responsible only for its own presentation — no carousel, no modal logic.
 *
 * The [data-video-card] attribute is picked up by the delegated click handler
 * in video-modal.js (initVideoModal) to open the modal.
 */

import { ThumbnailResolver } from './ThumbnailResolver.js';
import { Analytics }         from './analytics.js';

/**
 * Creates a YouTube video card element.
 * @param {import('../providers/MediaProvider.js').VideoEntry} item
 * @returns {HTMLElement}
 */
export function createVideoCard(item) {
  const card = document.createElement('article');
  card.className = 'vc-card';
  card.setAttribute('data-video-card', '');
  card.setAttribute('data-youtube-url', item.youtubeUrl);
  card.setAttribute('data-title', item.title);
  card.setAttribute('data-description', '');
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Play video: ${item.title}`);

  card.innerHTML = `
    <div class="vc-card__thumb-wrap">
      <div class="vc-skeleton vc-card__thumb-skeleton" aria-hidden="true"></div>
      <img class="vc-card__thumb" alt="${escHtml(item.title)}" loading="lazy" decoding="async">
      <div class="vc-card__play-btn" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5.14v14l11-7-11-7z"/>
        </svg>
      </div>
      ${item.duration ? `<span class="vc-card__duration">${escHtml(item.duration)}</span>` : ''}
      <span class="vc-card__badge vc-card__badge--yt" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2s-.2-1.7-1-2.4c-1-1-2.1-1-2.6-1.1C17 2.5 12 2.5 12 2.5s-5 0-7.9.2C3.6 2.8 2.5 2.8 1.5 3.8c-.8.7-1 2.4-1 2.4S.3 8.2.3 10.1v1.8c0 1.9.2 3.9.2 3.9s.2 1.7 1 2.4c1 1 2.3.9 2.9 1C6.3 19.3 12 19.4 12 19.4s5 0 7.9-.3c.6-.1 1.7-.1 2.6-1.1.8-.7 1-2.4 1-2.4s.2-2 .2-3.9v-1.8c0-1.9-.2-3.9-.2-3.9zM9.7 14.6V8.9l7 2.9-7 2.8z"/></svg>
        YouTube
      </span>
    </div>
    <div class="vc-card__meta">
      <p class="vc-card__title">${escHtml(item.title)}</p>
    </div>
  `;

  // Resolve thumbnail with 4-level fallback
  const img      = card.querySelector('.vc-card__thumb');
  const skeleton = card.querySelector('.vc-card__thumb-skeleton');
  ThumbnailResolver.resolve(item.youtubeUrl, img, skeleton);

  // Analytics on interaction
  const fireAnalytics = () => Analytics.videoOpened(item.title, item.youtubeUrl);
  card.addEventListener('click', fireAnalytics);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });

  return card;
}

/** Escapes HTML special characters to prevent XSS */
function escHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
