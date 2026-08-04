/**
 * ThumbnailResolver.js — YouTube Thumbnail Loader
 *
 * Direct YouTube CDN (i.ytimg.com) thumbnail resolver.
 * Loads hqdefault.jpg (480×360) directly from YouTube for maximum speed,
 * reliability, and crisp visual presentation.
 */

/** Inline SVG placeholder for missing/invalid videos */
const ERROR_PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='270' viewBox='0 0 480 270'%3E%3Crect width='480' height='270' fill='%23D3E2C4'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-size='14' fill='%2355771A'%3EVideo unavailable%3C/text%3E%3C/svg%3E`;

export const ThumbnailResolver = {
  /**
   * Extracts YouTube video ID from any YouTube URL format.
   * Supports: watch?v=, youtu.be/, embed/, shorts/
   * @param {string} url
   * @returns {string|null}
   */
  extractId(url) {
    if (!url) return null;
    const patterns = [
      /[?&]v=([A-Za-z0-9_-]{11})/,
      /youtu\.be\/([A-Za-z0-9_-]{11})/,
      /embed\/([A-Za-z0-9_-]{11})/,
      /shorts\/([A-Za-z0-9_-]{11})/,
    ];
    for (const re of patterns) {
      const m = url.match(re);
      if (m) return m[1];
    }
    return null;
  },

  /**
   * Loads the YouTube video thumbnail directly from YouTube's CDN (i.ytimg.com).
   * @param {string}           youtubeUrl  - Full YouTube URL
   * @param {HTMLImageElement} imgEl       - The <img> element to populate
   * @param {HTMLElement|null} skeletonEl  - Skeleton placeholder element
   */
  resolve(youtubeUrl, imgEl, skeletonEl) {
    const id = this.extractId(youtubeUrl);

    if (!id) {
      imgEl.src = ERROR_PLACEHOLDER;
      skeletonEl?.remove();
      return;
    }

    const removeSkeleton = () => {
      skeletonEl?.classList.add('vc-skeleton--hidden');
      if (skeletonEl) {
        setTimeout(() => skeletonEl.remove(), 250);
      }
    };

    imgEl.onload = () => {
      removeSkeleton();
    };

    imgEl.onerror = () => {
      // Fallback to mqdefault if hqdefault fails
      imgEl.onerror = () => {
        imgEl.src = ERROR_PLACEHOLDER;
        removeSkeleton();
      };
      imgEl.src = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
    };

    // Load hqdefault directly from YouTube CDN
    imgEl.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    if (imgEl.complete && imgEl.naturalWidth > 0) {
      removeSkeleton();
    }
  }
};
