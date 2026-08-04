/**
 * about.js — Why Us Page Orchestrator (2 Media Sections: YouTube & Instagram)
 */

import { SITE_CONFIG }            from './site-config.js';
import { StaticDataProvider }     from './providers/StaticDataProvider.js';
import { MediaCarousel }          from './media/MediaCarousel.js';
import { createVideoCard }        from './media/VideoCard.js';
import { createInstagramCard,
         createInstagramCtaCard } from './media/InstagramCard.js';
import { Analytics }              from './media/analytics.js';

const provider = new StaticDataProvider();

async function init() {
  try {
    const [youtubeVideos, igPosts] = await Promise.all([
      provider.getLearnVideos().catch(() => []),
      provider.getInstagramPosts().catch(() => []),
    ]);

    // ── Section 1: YouTube Videos Carousel ──────────────────────────────────
    const learnTrack = document.getElementById('learn-track');
    if (learnTrack) {
      new MediaCarousel({
        track:       learnTrack,
        items:       youtubeVideos,
        cardFactory: createVideoCard,
        prevBtn:     document.getElementById('learn-prev'),
        nextBtn:     document.getElementById('learn-next'),
        sectionEl:   document.getElementById('learn-with-megha'),
        ariaLabel:   'YouTube videos by Megha Kiran',
      });
    }

    // ── Section 2: Instagram Reels Carousel ─────────────────────────────────
    const igTrack = document.getElementById('ig-track');
    if (igTrack) {
      const igItems = [
        ...igPosts,
        { __ctaCard: true, url: SITE_CONFIG.instagram },
      ];

      new MediaCarousel({
        track:       igTrack,
        items:       igItems,
        cardFactory: (item) =>
          item.__ctaCard
            ? createInstagramCtaCard(item.url)
            : createInstagramCard(item),
        sectionEl:   document.getElementById('instagram'),
        ariaLabel:   'NutriNest Instagram reels',
      });
    }

    // ── CTA analytics & URLs ──────────────────────────────────────────────────
    document.getElementById('cta-book')?.addEventListener('click', Analytics.bookConsultation);
    document.getElementById('cta-whatsapp')?.addEventListener('click', Analytics.whatsappClicked);

    const whatsappBtns = document.querySelectorAll('[data-whatsapp-btn]');
    whatsappBtns.forEach(btn => { btn.href = SITE_CONFIG.whatsapp; });

    const ytLinks = document.querySelectorAll('[data-yt-channel-link]');
    ytLinks.forEach(link => { link.href = SITE_CONFIG.youtube; });

  } catch (err) {
    console.error('[about.js] Initialization error:', err);
  }
}

document.addEventListener('DOMContentLoaded', init);
