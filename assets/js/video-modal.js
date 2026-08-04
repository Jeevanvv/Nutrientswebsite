/**
 * video-modal.js — Responsive YouTube Video Modal Component
 *
 * Handles lazy-loading, modal opening/closing, focus trapping, Escape key closing.
 *
 * Public API:
 *   initVideoModal()  — call once on DOMContentLoaded (done in main.js)
 *   openModal(url, title, desc, onOpenCb)  — programmatic open
 *   closeModal()      — programmatic close
 *
 * Delegated click handler: any element with [data-video-card] and
 * [data-youtube-url] will automatically open the modal when clicked.
 *
 * Backward compatible: all existing callers of initVideoModal() continue to work.
 */

export function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Module-level references so openModal/closeModal can be exported
let _modal           = null;
let _playerContainer = null;
let _titleEl         = null;
let _descEl          = null;
let _ytBtn           = null;
let _closeBtn        = null;
let _lastFocus       = null;
let _initialized     = false;

function ensureModal() {
  if (_modal) return;

  _modal = document.getElementById('video-modal');
  if (!_modal) {
    _modal = document.createElement('div');
    _modal.id = 'video-modal';
    _modal.className = 'video-modal';
    _modal.setAttribute('role', 'dialog');
    _modal.setAttribute('aria-modal', 'true');
    _modal.setAttribute('aria-hidden', 'true');
    _modal.hidden = true;
    _modal.innerHTML = `
      <div class="video-modal__backdrop" id="video-modal-backdrop"></div>
      <div class="video-modal__dialog" role="document">
        <button type="button" class="video-modal__close" id="video-modal-close" aria-label="Close video player">&times;</button>
        <div class="video-modal__player-wrap">
          <div class="video-modal__player" id="video-modal-player"></div>
        </div>
        <div class="video-modal__footer">
          <div class="video-modal__info">
            <h3 class="video-modal__title" id="video-modal-title"></h3>
            <p class="video-modal__desc" id="video-modal-desc"></p>
          </div>
          <a href="#" class="btn btn--ghost btn--sm video-modal__yt-btn" id="video-modal-yt-btn" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
        </div>
      </div>
    `;
    document.body.appendChild(_modal);
  }

  _playerContainer = document.getElementById('video-modal-player');
  _titleEl         = document.getElementById('video-modal-title');
  _descEl          = document.getElementById('video-modal-desc');
  _ytBtn           = document.getElementById('video-modal-yt-btn');
  _closeBtn        = document.getElementById('video-modal-close');
}

/**
 * Opens the video modal with the given YouTube URL.
 * @param {string}   youtubeUrl  - Full YouTube URL
 * @param {string}   [title]     - Video title
 * @param {string}   [description]
 * @param {Function} [onOpenCb]  - Optional analytics / callback hook
 */
export function openModal(youtubeUrl, title = '', description = '', onOpenCb) {
  ensureModal();
  const videoId = extractYouTubeId(youtubeUrl);
  if (!videoId) return;

  _lastFocus = document.activeElement;

  _titleEl.textContent = title;
  _descEl.textContent  = description;
  _ytBtn.href          = youtubeUrl;

  // Lazy-create iframe only on open (deferred until click)
  _playerContainer.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
      title="${title || 'YouTube Video Player'}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;

  _modal.hidden = false;
  _modal.setAttribute('aria-hidden', 'false');
  _modal.classList.add('is-open');
  document.body.classList.add('video-modal-open');

  setTimeout(() => _closeBtn?.focus(), 50);

  onOpenCb?.();
}

/**
 * Closes the video modal and immediately destroys the iframe to stop playback.
 */
export function closeModal() {
  if (!_modal || _modal.hidden) return;

  // Destroy iframe → stops audio/video immediately
  _playerContainer.innerHTML = '';

  _modal.classList.remove('is-open');
  _modal.setAttribute('aria-hidden', 'true');
  _modal.hidden = true;
  document.body.classList.remove('video-modal-open');

  if (_lastFocus && typeof _lastFocus.focus === 'function') {
    _lastFocus.focus();
  }
}

/**
 * Initializes the video modal.
 * Call once on DOMContentLoaded — already called in main.js.
 * Attaches delegated click handler for [data-video-card] elements.
 */
export function initVideoModal() {
  if (_initialized) return;
  _initialized = true;

  ensureModal();

  const backdrop = document.getElementById('video-modal-backdrop');
  if (_closeBtn) _closeBtn.addEventListener('click', closeModal);
  if (backdrop)  backdrop.addEventListener('click', closeModal);

  // Delegated handler: any [data-video-card] anywhere on the page
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-video-card]');
    if (card) {
      const url   = card.dataset.youtubeUrl;
      const title = card.dataset.title;
      const desc  = card.dataset.description;
      if (url) {
        e.preventDefault();
        openModal(url, title, desc);
      }
    }
  });

  // "Watch on YouTube ↗" analytics
  document.getElementById('video-modal-yt-btn')?.addEventListener('click', () => {
    const title = _titleEl?.textContent || '';
    const url   = _ytBtn?.href || '';
    // Dynamic import to avoid circular dep at startup
    import('./media/analytics.js').then(({ Analytics }) => {
      Analytics.watchOnYouTube(title, url);
    }).catch(() => {});
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && _modal && !_modal.hidden) {
      closeModal();
    }
  });
}
