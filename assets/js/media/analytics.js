/**
 * analytics.js — NutriNest Analytics Event Stubs
 *
 * All functions are no-ops today. To enable analytics:
 *  1. Choose a provider (Google Analytics 4, Mixpanel, Plausible, etc.)
 *  2. Load their SDK script
 *  3. Replace each function body below with the appropriate tracking call
 *
 * All callers (MediaCarousel, VideoCard, InstagramCard, about.js) remain
 * completely unchanged — only this file needs to be updated.
 *
 * Example GA4 implementation:
 *   videoOpened: (title, url) => gtag('event', 'video_open', { title, url }),
 */

export const Analytics = {
  /**
   * Fired when a user taps/clicks a video card to open the modal.
   * @param {string} title - Video title
   * @param {string} url   - YouTube URL
   */
  videoOpened: (title, url) => {
    // TODO: gtag('event', 'video_open', { event_category: 'media', title, url });
  },

  /**
   * Fired when a video completes playback (requires YouTube IFrame API).
   * @param {string} title
   * @param {string} url
   */
  videoCompleted: (title, url) => {
    // TODO: gtag('event', 'video_complete', { event_category: 'media', title, url });
  },

  /**
   * Fired when the "Watch on YouTube ↗" button is clicked.
   * @param {string} title
   * @param {string} url
   */
  watchOnYouTube: (title, url) => {
    // TODO: gtag('event', 'watch_on_youtube', { event_category: 'media', title, url });
  },

  /**
   * Fired when an Instagram card is clicked.
   * @param {string} label - Post label / alt text
   * @param {string} url   - Instagram post URL
   */
  instagramClicked: (label, url) => {
    // TODO: gtag('event', 'instagram_click', { event_category: 'social', label, url });
  },

  /**
   * Fired when the "Book Consultation" CTA button is clicked.
   */
  bookConsultation: () => {
    // TODO: gtag('event', 'cta_click', { event_category: 'conversion', label: 'book_consultation' });
  },

  /**
   * Fired when the "WhatsApp Now" button is clicked.
   */
  whatsappClicked: () => {
    // TODO: gtag('event', 'cta_click', { event_category: 'conversion', label: 'whatsapp' });
  },
};
