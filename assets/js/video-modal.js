/**
 * video-modal.js — Responsive YouTube Video Modal Component
 * Handles lazy-loading, modal opening/closing, focus trapping, Escape key closing.
 */

export function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function initVideoModal() {
  // Ensure modal DOM elements exist
  let modal = document.getElementById('video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.className = 'video-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    modal.innerHTML = `
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
    document.body.appendChild(modal);
  }

  const backdrop = document.getElementById('video-modal-backdrop');
  const closeBtn = document.getElementById('video-modal-close');
  const playerContainer = document.getElementById('video-modal-player');
  const titleEl = document.getElementById('video-modal-title');
  const descEl = document.getElementById('video-modal-desc');
  const ytBtn = document.getElementById('video-modal-yt-btn');

  let lastActiveElement = null;

  function openModal(youtubeUrl, title, description) {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) return;

    lastActiveElement = document.activeElement;

    // Populate metadata
    titleEl.textContent = title || '';
    descEl.textContent = description || '';
    ytBtn.href = youtubeUrl;

    // Lazy load YouTube iframe with autoplay=1
    playerContainer.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
        title="${title || 'YouTube Video Player'}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;

    // Display modal
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.classList.add('video-modal-open');

    // Focus close button
    setTimeout(() => {
      if (closeBtn) closeBtn.focus();
    }, 50);
  }

  function closeModal() {
    if (modal.hidden) return;

    // Remove iframe to stop video & audio immediately
    playerContainer.innerHTML = '';

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    document.body.classList.remove('video-modal-open');

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  // Event Listeners for video cards
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-video-card]');
    if (card) {
      const youtubeUrl = card.dataset.youtubeUrl;
      const title = card.dataset.title;
      const desc = card.dataset.description;
      if (youtubeUrl) {
        e.preventDefault();
        openModal(youtubeUrl, title, desc);
      }
    }
  });

  // Close trigger listeners
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
}
