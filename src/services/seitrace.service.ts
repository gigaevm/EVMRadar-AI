import axios from "axios";

export interface SeitraceTransfer {
  tx_hash: string;
  from: string;
  to: string;
  amount: string;
  tokenSymbol: string;
  timestamp: string;
}

export const getRecentTransfers = async (
  contractAddress: string,
  apiKey?: string
): Promise<SeitraceTransfer[]> => {
  try {
    // take the last 10-minute interval
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    const fromDate = tenMinutesAgo.toISOString(); // ✅ ISO 8601
    const toDate = now.toISOString();

    const url = `https://seitrace.com/insights/api/v2/token/erc20/transfers?chain_id=pacific-1&contract_address=${contractAddress}&from_date=${fromDate}&to_date=${toDate}`;

    const headers: Record<string, string> = {};
    if (apiKey) headers["X-Api-Key"] = apiKey;

    const { data } = await axios.get(url, { headers });

    if (!data || !data.items) {
      console.log("⚠️ Respon Seitrace tidak sesuai format:", data);
      return [];
    }

    return data.items.map((tx: any) => ({
      tx_hash: tx.tx_hash,
      from: tx.from?.address_hash || "",
      to: tx.to?.address_hash || "",
      amount: tx.amount || tx.raw_amount || "0",
      tokenSymbol: tx.token_info?.token_symbol || "",
      timestamp: tx.timestamp || "",
    }));
  } catch (error: any) {
    console.error("❌ Failed to retrieve data from Seitrace:", error.response?.data || error.message);
    return [];
  }
};

// ✅ Filter BUY (to = pairAddress)
export const isBuyTx = (tx: SeitraceTransfer, pairAddress: string) => {
  return tx.to.toLowerCase() === pairAddress.toLowerCase();
};
