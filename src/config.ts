import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  // === Blockchain & Token ===
  tokenPairAddress: "0x8ba502d9243fa5e44678044098be9782cebafda5", // pair from Dexscreener
  contractAddress: "0x5f0E07dFeE5832Faa00c63F2D33A0D79150E8598",  // CA Here

  // === Buy filter ===
  minBuyUSD: 0.01,
  maxBuyUSD: 99999,

  // === Bot settings ===
  checkIntervalMs: 10_000, // 10 Second
  alertImageUrl: "https://i.imgur.com/alert.jpg",

  // === Secrets (taken from .env) ===
  seitraceApiKey: process.env.SEITRACE_API_KEY || "",
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramChannelId: process.env.TELEGRAM_CHANNEL_ID || "",
};
