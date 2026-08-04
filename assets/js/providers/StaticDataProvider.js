/**
 * StaticDataProvider.js — Current data provider
 *
 * Implements the MediaProvider interface using local data files.
 * This is the provider wired up in about.js today.
 *
 * To switch to the YouTube Data API:
 *   In about.js, replace:
 *     import { StaticDataProvider } from './providers/StaticDataProvider.js';
 *     const provider = new StaticDataProvider();
 *   With:
 *     import { YouTubeAPIProvider } from './providers/YouTubeAPIProvider.js';
 *     const provider = new YouTubeAPIProvider(API_KEY, CHANNEL_ID);
 *
 * Zero UI changes required.
 *
 * @implements {MediaProvider}
 */

import { learnVideos }          from '../data/learn-videos.js';
import { transformationVideos } from '../data/transformation-videos.js';
import { instagramPosts }       from '../data/instagram-posts.js';

export class StaticDataProvider {
  /**
   * @returns {Promise<import('./MediaProvider.js').VideoEntry[]>}
   */
  async getLearnVideos() {
    return learnVideos;
  }

  /**
   * @returns {Promise<import('./MediaProvider.js').TransformationEntry[]>}
   */
  async getTransformationVideos() {
    return transformationVideos;
  }

  /**
   * @returns {Promise<import('./MediaProvider.js').InstagramPost[]>}
   */
  async getInstagramPosts() {
    return instagramPosts;
  }
}
