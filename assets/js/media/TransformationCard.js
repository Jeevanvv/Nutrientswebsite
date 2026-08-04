/**
 * TransformationCard.js — Client Story Video Card Component
 *
 * Pure factory function: receives a TransformationEntry, returns an HTMLElement.
 * Same interaction model as VideoCard (opens video modal via [data-video-card]),
 * but with different visual presentation: client name eyebrow, green "Client Story"
 * badge, and optional description line.
 */

import { ThumbnailResolver } from './ThumbnailResolver.js';
import { Analytics }         from './analytics.js';

/**
 * Creates a client transformation story card element.
 * @param {import('../providers/MediaProvider.js').TransformationEntry} item
 * @returns {HTMLElement}
 */
export function createTransformationCard(item) {
  const card = document.createElement('article');
  card.className = 'vc-card vc-card--story';
  card.setAttribute('data-video-card', '');
  card.setAttribute('data-youtube-url', item.youtubeUrl);
  card.setAttribute('data-title', item.title);
  card.setAttribute('data-description', item.desc || '');
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Watch story: ${item.clientName} — ${item.title}`);

  card.innerHTML = `
    <div class="vc-card__thumb-wrap">
      <div class="vc-skeleton vc-card__thumb-skeleton" aria-hidden="true"></div>
      <img class="vc-card__thumb" alt="${escHtml(item.title)}" loading="lazy" decoding="async">
      <div class="vc-card__play-btn" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5.14v14l11-7-11-7z"/>
        </svg>
      </div>
      ${item.duration ? `<span class="vc-card__duration">${escHtml(item.duration)}</span>` : ''}
      <span class="vc-card__badge vc-card__badge--story" aria-hidden="true">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        Client Story
      </span>
    </div>
    <div class="vc-card__meta">
      <p class="vc-card__client">${escHtml(item.clientName)}</p>
      <p class="vc-card__title">${escHtml(item.title)}</p>
      ${item.desc ? `<p class="vc-card__desc">${escHtml(item.desc)}</p>` : ''}
    </div>
  `;

  // Resolve thumbnail with 4-level fallback
  const img      = card.querySelector('.vc-card__thumb');
  const skeleton = card.querySelector('.vc-card__thumb-skeleton');
  ThumbnailResolver.resolve(item.youtubeUrl, img, skeleton);

  // Analytics
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

function escHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
