/**
 * YouTubeAPIProvider.js — Future YouTube Data API v3 Provider
 *
 * Scaffold ready for implementation when a YouTube Data API key is available.
 * Implements the same MediaProvider interface as StaticDataProvider.
 *
 * Usage (in about.js):
 *   import { YouTubeAPIProvider } from './providers/YouTubeAPIProvider.js';
 *   const provider = new YouTubeAPIProvider(API_KEY, CHANNEL_ID);
 *
 * The returned data shape is identical to StaticDataProvider, so all UI
 * components (MediaCarousel, card components) require zero changes.
 *
 * @implements {MediaProvider}
 */

import { StaticDataProvider } from './StaticDataProvider.js';

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

export class YouTubeAPIProvider {
  /**
   * @param {string} apiKey       - YouTube Data API v3 key
   * @param {string} channelId    - Channel ID (not handle — looks like UCxxxxxxx)
   * @param {string} [playlistId] - Optional playlist for transformation stories
   */
  constructor(apiKey, channelId, playlistId = '') {
    this.apiKey     = apiKey;
    this.channelId  = channelId;
    this.playlistId = playlistId;
    this._fallback  = new StaticDataProvider();
  }

  /**
   * Fetches the most recent uploads from the channel.
   * Falls back to static data if the API is unavailable.
   * @returns {Promise<import('./MediaProvider.js').VideoEntry[]>}
   */
  async getLearnVideos() {
    try {
      // 1. Get the uploads playlist ID for the channel
      const channelRes = await fetch(
        `${YT_API_BASE}/channels?part=contentDetails&id=${this.channelId}&key=${this.apiKey}`
      );
      const channelData = await channelRes.json();
      const uploadsId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
      if (!uploadsId) throw new Error('Could not retrieve uploads playlist');

      // 2. Get videos from the uploads playlist
      const playlistRes = await fetch(
        `${YT_API_BASE}/playlistItems?part=snippet&maxResults=20&playlistId=${uploadsId}&key=${this.apiKey}`
      );
      const playlistData = await playlistRes.json();

      // 3. Map to VideoEntry shape
      return (playlistData?.items || []).map(item => ({
        title:      item.snippet.title,
        youtubeUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        duration:   '' // Duration requires a separate /videos?part=contentDetails call
      }));
    } catch (err) {
      console.warn('[YouTubeAPIProvider] Falling back to static data:', err.message);
      return this._fallback.getLearnVideos();
    }
  }

  /**
   * Fetches videos from a dedicated transformation stories playlist.
   * Falls back to static data if no playlist ID is configured.
   * @returns {Promise<import('./MediaProvider.js').TransformationEntry[]>}
   */
  async getTransformationVideos() {
    if (!this.playlistId) {
      return this._fallback.getTransformationVideos();
    }
    try {
      const res  = await fetch(
        `${YT_API_BASE}/playlistItems?part=snippet&maxResults=20&playlistId=${this.playlistId}&key=${this.apiKey}`
      );
      const data = await res.json();
      return (data?.items || []).map(item => ({
        clientName: 'Client Story',
        title:      item.snippet.title,
        desc:       item.snippet.description?.split('\n')[0] || '',
        youtubeUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        duration:   ''
      }));
    } catch (err) {
      console.warn('[YouTubeAPIProvider] Transformation fallback:', err.message);
      return this._fallback.getTransformationVideos();
    }
  }

  /**
   * YouTube provider doesn't serve Instagram posts.
   * Delegates to StaticDataProvider.
   * @returns {Promise<import('./MediaProvider.js').InstagramPost[]>}
   */
  async getInstagramPosts() {
    return this._fallback.getInstagramPosts();
  }
}
