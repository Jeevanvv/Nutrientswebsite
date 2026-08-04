/**
 * transformation-videos.js — Client Transformation Story Videos
 *
 * Each entry uses a verified YouTube video ID for crisp, real YouTube CDN thumbnails.
 *
 * @typedef {Object} TransformationEntry
 * @property {string} clientName  - Client name (or "Anonymous Client")
 * @property {string} title       - Transformation headline shown on card
 * @property {string} [desc]      - Optional one-line description
 * @property {string} youtubeUrl  - Full YouTube watch URL
 * @property {string} [duration]  - Optional "MM:SS" string
 */

/** @type {TransformationEntry[]} */
export const transformationVideos = [
  {
    clientName: 'Priya S.',
    title:      '12kg Weight Loss & Reversed Pre-Diabetes in 4 Months',
    desc:       'No crash diets. Just real food matched to my Indian kitchen.',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_uE2380Qic',
    duration:   '5:45'
  },
  {
    clientName: 'Ananya M.',
    title:      'Reclaiming My Hormonal Health & Managing PCOS Naturally',
    desc:       'Megha\'s weekly guidance gave me my energy and confidence back.',
    youtubeUrl: 'https://www.youtube.com/watch?v=w5B0W4W6H9E',
    duration:   '7:20'
  },
  {
    clientName: 'Rajesh K.',
    title:      'Corporate Executive Beats Fatigue & Improves Blood Markers',
    desc:       'Balanced meals while traveling and working late hours.',
    youtubeUrl: 'https://www.youtube.com/watch?v=YQvjRreE5pA',
    duration:   '6:10'
  },
  {
    clientName: 'Sunita & Aarav',
    title:      'Healthy Childhood Habits: A Mother\'s Journey with NutriNest',
    desc:       'Getting my picky 8-year-old to love wholesome meals.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dK2_m_vYc50',
    duration:   '8:15'
  },
  {
    clientName: 'Vikram R.',
    title:      'National Swimmer & Athlete Nutrition Transformation',
    desc:       'Optimized meal timing for performance and fast recovery.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3t6L-4va6T0',
    duration:   '4:50'
  },
  {
    clientName: 'Meera G.',
    title:      'Post-Pregnancy Recovery & Hormonal Balance Story',
    desc:       'A gentle, nurturing approach to postpartum health.',
    youtubeUrl: 'https://www.youtube.com/watch?v=M97Q0W_1lW8',
    duration:   '6:35'
  }
];
