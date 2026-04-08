import axios from 'axios';
import logger from '../utils/logger';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export class PriceService {
  private cache: Map<string, { price: number; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60 * 1000; // 1 minute cache

  /**
   * Fetches the current USD price for a given CoinGecko ID.
   */
  async getPrice(coinId: string): Promise<number> {
    // Check cache
    const cached = this.cache.get(coinId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.price;
    }

    try {
      // For $W3B3, we might need a fallback if it's not on CG yet
      if (coinId === 'w3b3') {
        const fallbackPrice = parseFloat(process.env.W3B3_INITIAL_PRICE || '0.25');
        return fallbackPrice;
      }

      const response = await axios.get(`${COINGECKO_API_BASE}/simple/price`, {
        params: {
          ids: coinId,
          vs_currencies: 'usd',
        },
      });

      const price = response.data[coinId]?.usd;
      
      if (price !== undefined) {
        this.cache.set(coinId, { price, timestamp: Date.now() });
        return price;
      }

      throw new Error(`Price not found for ${coinId}`);
    } catch (error) {
      logger.error(`Error fetching price for ${coinId}:`, error);
      // Return a reasonable baseline if API fails
      if (coinId === 'ethereum') return 3500;
      return 0;
    }
  }

  /**
   * Bulk fetch prices
   */
  async getPrices(coinIds: string[]): Promise<Record<string, number>> {
    try {
      const response = await axios.get(`${COINGECKO_API_BASE}/simple/price`, {
        params: {
          ids: coinIds.join(','),
          vs_currencies: 'usd',
        },
      });

      const result: Record<string, number> = {};
      coinIds.forEach((id) => {
        if (response.data[id]) {
          result[id] = response.data[id].usd;
          this.cache.set(id, { price: result[id], timestamp: Date.now() });
        }
      });
      
      return result;
    } catch (error) {
      logger.error('Error fetching bulk prices:', error);
      return {};
    }
  }
}

export const priceService = new PriceService();
