/**
 * InstagramProvider.js — Future Instagram Graph API Provider
 *
 * Scaffold ready for implementation when an Instagram access token is available.
 * Implements the same MediaProvider interface as StaticDataProvider.
 *
 * Usage (in about.js):
 *   import { InstagramProvider } from './providers/InstagramProvider.js';
 *   const provider = new InstagramProvider(ACCESS_TOKEN);
 *
 * Note: Instagram's Basic Display API requires user authentication.
 * The Business Discovery API requires a Facebook Business Page linked account.
 * Server-side token refresh is strongly recommended for production use.
 *
 * @implements {MediaProvider}
 */

import { StaticDataProvider } from './StaticDataProvider.js';

const IG_API_BASE = 'https://graph.instagram.com';

export class InstagramProvider {
  /**
   * @param {string} accessToken - Instagram Graph API access token
   * @param {number} [limit=6]   - Max number of posts to fetch
   */
  constructor(accessToken, limit = 6) {
    this.token    = accessToken;
    this.limit    = limit;
    this._fallback = new StaticDataProvider();
  }

  /**
   * Fetches recent Instagram media and maps to InstagramPost shape.
   * Falls back to static data if the API is unavailable.
   * @returns {Promise<import('./MediaProvider.js').InstagramPost[]>}
   */
  async getInstagramPosts() {
    try {
      const res  = await fetch(
        `${IG_API_BASE}/me/media?fields=id,caption,media_type,thumbnail_url,media_url,permalink&limit=${this.limit}&access_token=${this.token}`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      return (data?.data || []).map(item => ({
        label:        item.caption?.split('\n')[0] || 'Instagram post',
        instagramUrl: item.permalink,
        thumbnail:    item.thumbnail_url || item.media_url || ''
      }));
    } catch (err) {
      console.warn('[InstagramProvider] Falling back to static data:', err.message);
      return this._fallback.getInstagramPosts();
    }
  }

  /**
   * Instagram provider doesn't serve YouTube videos.
   * Delegates to StaticDataProvider.
   */
  async getLearnVideos()          { return this._fallback.getLearnVideos(); }
  async getTransformationVideos() { return this._fallback.getTransformationVideos(); }
}
