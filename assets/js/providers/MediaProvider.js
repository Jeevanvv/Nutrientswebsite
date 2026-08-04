/**
 * MediaProvider.js — Interface Contract
 *
 * Every data provider (static files, YouTube Data API, Instagram Graph API,
 * Sanity, Contentful, custom backend) must implement this interface.
 *
 * The UI layer (MediaCarousel, card components, about.js) only ever calls
 * these three methods. It never imports from a specific provider directly —
 * only from whichever provider is wired up in about.js.
 *
 * To switch providers: change ONE import line in about.js. Zero UI changes.
 *
 * @interface MediaProvider
 */

/**
 * @typedef {Object} VideoEntry
 * @property {string}  title       - Display title
 * @property {string}  youtubeUrl  - Full YouTube watch URL
 * @property {string}  [duration]  - Optional "MM:SS" e.g. "12:34"
 */

/**
 * @typedef {Object} TransformationEntry
 * @property {string}  clientName  - Client display name
 * @property {string}  title       - Transformation headline
 * @property {string}  [desc]      - Optional one-line description
 * @property {string}  youtubeUrl  - Full YouTube watch URL
 * @property {string}  [duration]  - Optional "MM:SS"
 */

/**
 * @typedef {Object} InstagramPost
 * @property {string}  label        - Alt text / aria-label
 * @property {string}  instagramUrl - Link to the post or reel
 * @property {string}  thumbnail    - Image path (local or remote)
 */

/**
 * Returns educational YouTube videos for the "Learn with Megha" carousel.
 * @function
 * @name MediaProvider#getLearnVideos
 * @returns {Promise<VideoEntry[]>}
 */

/**
 * Returns client story videos for the "Transformation Stories" carousel.
 * @function
 * @name MediaProvider#getTransformationVideos
 * @returns {Promise<TransformationEntry[]>}
 */

/**
 * Returns Instagram posts for the "Follow Our Journey" carousel.
 * @function
 * @name MediaProvider#getInstagramPosts
 * @returns {Promise<InstagramPost[]>}
 */
