// src/services/dexscreener.service.ts
import axios from "axios";

// Define the interface for all the data we need.
export interface DexPairInfo {
  priceUsd: string;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  baseTokenName: string;
  baseTokenSymbol: string;
}

export const getPairInfo = async (pairAddress: string): Promise<DexPairInfo | null> => {
  try {
    const url = `https://api.dexscreener.com/latest/dex/pairs/seiv2/${pairAddress}`;
    const { data } = await axios.get(url);

    if (!data || !data.pairs || data.pairs.length === 0) {
      console.error("⚠️ DexScreener response was empty or malformed.");
      return null;
    }

    const pair = data.pairs[0];

    // Extract all the data we need
    return {
      priceUsd: pair.priceUsd,
      volume24h: pair.volume?.h24,
      liquidity: pair.liquidity?.usd,
      marketCap: pair.fdv, // Fully Diluted Valuation (Market Cap)
      baseTokenName: pair.baseToken?.name,
      baseTokenSymbol: pair.baseToken?.symbol,
    };
  } catch (error: any) {
    console.error("❌ DexScreener API error:", error.response?.data || error.message);
    return null;
  }
};
