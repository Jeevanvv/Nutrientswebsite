/**
 * instagram-posts.js — Real Instagram Reels Data from NutriNest with Megha
 *
 * Live embedded Instagram Reels using Instagram official embed endpoints.
 */

/**
 * @typedef {Object} InstagramPost
 * @property {string} label        - Accessible title / label
 * @property {string} instagramUrl - Direct link to post/reel on Instagram
 * @property {string} embedUrl     - Live Instagram iframe embed URL
 */

/** @type {InstagramPost[]} */
export const instagramPosts = [
  {
    label:        'NutriNest with Megha — Reel 1',
    instagramUrl: 'https://www.instagram.com/nutrinestwithmegha/reel/DblGcsQsrjl/',
    embedUrl:     'https://www.instagram.com/reel/DblGcsQsrjl/embed'
  },
  {
    label:        'NutriNest with Megha — Reel 2',
    instagramUrl: 'https://www.instagram.com/nutrinestwithmegha/reel/DbiZx6Lsr5i/',
    embedUrl:     'https://www.instagram.com/reel/DbiZx6Lsr5i/embed'
  },
  {
    label:        'NutriNest with Megha — Reel 3',
    instagramUrl: 'https://www.instagram.com/nutrinestwithmegha/reel/DbdYp4uMr-A/',
    embedUrl:     'https://www.instagram.com/reel/DbdYp4uMr-A/embed'
  },
  {
    label:        'NutriNest with Megha — Post 4',
    instagramUrl: 'https://www.instagram.com/nutrinestwithmegha/p/DbVugwpRcoC/',
    embedUrl:     'https://www.instagram.com/p/DbVugwpRcoC/embed'
  }
];
