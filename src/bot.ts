// File: src/bot.ts 

import 'dotenv/config';

import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';
// Pastikan DexPairInfo di-export dari dexscreener.service.ts
import { getPairInfo, DexPairInfo } from './services/dexscreener.service';
import { getRecentTransfers, isBuyTx } from './services/seitrace.service';
import { generateAIComment } from './services/gemini.service';


const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

const generateBuyBar = (usdValue: number): string => {
  if (usdValue < 50) return '🟢';
  if (usdValue < 250) return '🟢'.repeat(5);
  const barCount = Math.min(15, Math.floor(usdValue / 100));
  return '💪🏻🟢'.repeat(barCount);
};

const formatNumberWithCommas = (num: number | undefined): string => {
  if (num === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US').format(num);
};

const formatPriceWithSubscript = (price: number): string => {
  const priceStr = price.toPrecision(6);
  const [integer, decimal] = priceStr.split('.');
  if (!decimal || integer !== '0') return `$${price.toPrecision(4)}`;
  
  const leadingZeros = decimal.match(/^0*/)?.[0].length || 0;
  if (leadingZeros < 4) return `$${price.toFixed(8)}`;

  const subscriptMap: { [key: string]: string } = { '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
  const subscriptZeros = String(leadingZeros).split('').map(d => subscriptMap[d] || `_${d}`).join('');
  const restOfDecimal = decimal.substring(leadingZeros);
  
  return `$0.0${subscriptZeros}${restOfDecimal.substring(0, 4)}`;
};

// --- MAIN LOGIC OF THE BOT ---

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHANNEL_ID;

if (!token || !chatId) {
  console.error("❌ Ensure TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID are set in .env");
  process.exit(1);
}

const bot = new TelegramBot(token);
const processedTxnHashes = new Set<string>();

const main = () => {
  console.log("🤖 Advanced Buy Radar Bot Started...");
  console.log(`📡 Watching DexScreener Pair: ${config.tokenPairAddress}`);
  setInterval(checkForBuys, config.checkIntervalMs);
  checkForBuys();
};

const checkForBuys = async () => {
  console.log("... Checking for new transactions...");

  const transfers = await getRecentTransfers(config.contractAddress, config.seitraceApiKey);
  if (!transfers || transfers.length === 0) {
    console.log("⚠️ No new transactions found.");
    return;
  }

  const pairInfo = await getPairInfo(config.tokenPairAddress);
  if (!pairInfo) {
    console.log("⚠️ Could not fetch pair info from DexScreener.");
    return;
  }
  const price = parseFloat(pairInfo.priceUsd);

  for (const tx of transfers) {
    if (processedTxnHashes.has(tx.tx_hash)) continue;
    processedTxnHashes.add(tx.tx_hash);

    if (isBuyTx(tx, config.tokenPairAddress)) {
      const usdValue = price * parseFloat(tx.amount);
      if (usdValue >= config.minBuyUSD && usdValue <= config.maxBuyUSD) {
        console.log(`✅ BUY Detected! $${usdValue.toFixed(2)} of ${pairInfo.baseTokenSymbol}`);
        await handleBuyAlert(tx, usdValue, price, pairInfo);
      }
    }
  }
};

const handleBuyAlert = async (tx: any, usdValue: number, price: number, pairInfo: DexPairInfo) => {
  const aiComment = await generateAIComment(usdValue);
  const buyerShort = shortenAddress(tx.from);
  const tokenAmount = parseFloat(tx.amount);
  const percentageOfMcap = pairInfo.marketCap > 0 ? (usdValue / pairInfo.marketCap) * 100 : 0;

  const message = `
<b>🪙 ${pairInfo.baseTokenName}</b> (<a href="https://dexscreener.com/sei/${config.tokenPairAddress}">Chart</a>) Buy!
${generateBuyBar(usdValue)}

➡️ Paid: ~$${usdValue.toFixed(2)}
⬅️ Received: <b>${formatNumberWithCommas(tokenAmount)} ${pairInfo.baseTokenSymbol}</b> (${percentageOfMcap.toFixed(3)}%)

🧑‍💻 Buyer: <a href="https://www.seiscan.app/mainnet/address/${tx.from}">${buyerShort}</a> | <a href="https://www.seiscan.app/mainnet/tx/${tx.tx_hash}">Tx</a>
💰 ${pairInfo.baseTokenSymbol} Price: ${formatPriceWithSubscript(price)}
📊 24h Volume: $${formatNumberWithCommas(pairInfo.volume24h)}
💦 Liquidity: $${formatNumberWithCommas(pairInfo.liquidity)}
💎 Mkt. Cap: $${formatNumberWithCommas(pairInfo.marketCap)}

🔗 <a href="https://dexscreener.com/sei/${config.tokenPairAddress}">DexScreener</a> | <a href="https://dragonswap.app/swap?&outputCurrency=${config.contractAddress}">Trade</a> | <a href="https://www.seiscan.app/mainnet/token/${config.contractAddress}">Scan</a>

💬 <i>${aiComment}</i>
`;

  try {
    await bot.sendPhoto(chatId, config.alertImageUrl, {
      caption: message,
      parse_mode: 'HTML',
      
       
    });
    console.log("🚀 Full alert with image and AI sent successfully!");
  } catch (err) {
    console.error("❌ Failed to send full alert:", err);
  }
};

main();
