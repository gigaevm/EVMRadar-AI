<!-- Ganti placeholder di bawah ini -->
<div align="center">
  <img src="[https://res.cloudinary.com/dh7yebawk/image/upload/v1755655911/sadasd_iekxni.png]" alt="EVMRadar AI Logo" width="150"/>
  <h1>EVMRadar Agent</h1>
  <p>
    <b>A powerful, open-source framework to build your own persona-driven AI buy alert bots on the Sei EVM network.</b>
  </p>
  
  <p>
    <a href="https://github.com/[gigaevm]/[EVMRadar-AI]/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Telegram-2CA5E0?logo=telegram&logoColor=white" alt="Telegram">
  </p>
</div>

---


## ✨ Core Features

**EVMRadar Agent** isn't just another bot; it's a customizable engine. You can define the entire personality of the AI that delivers your alerts, making it perfect for any crypto community looking for a unique, branded, and engaging tool.

- **🤖 Fully Customizable AI Persona:** The heart of the bot! Easily define your AI's name, description, writing style, and strict rules in a single configuration file (`src/persona.ts`).
- **⚡ Real-Time Alerts:** Never miss a buy with instant notifications powered by the Seitrace Insights API.
- **📊 Rich Data:** Get all the alpha in one message: Market Cap, Liquidity, 24h Volume, token price, buyer address, and more from the DexScreener API.
- **🔗 Quick Links:** Instantly jump to the chart, the buyer's wallet, or the transaction on SeiScan.
- **🚀 Easy to Fork & Deploy:** Built with TypeScript and Node.js for a clean, understandable, and easily modifiable codebase.

## 🤔 Why a Custom Persona?

A custom AI persona transforms a simple alert tool into a true community mascot.
- **Strengthen Your Brand:** Create a bot that speaks in your project's unique voice.
- **Increase Engagement:** Fun, unique commentary makes tracking buys an exciting community event.
- **Stand Out:** Move beyond generic, boring alerts and offer something truly special.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Telegram Integration:** `node-telegram-bot-api`
- **Blockchain Data:** Seitrace Insights API
- **Market Data:** DexScreener API
- **AI Engine:** Google Gemini API

## 🚀 Getting Started

Follow these steps to get your own instance of the EVMRadar Agent running.

### 1. Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### 2. Installation

First, clone the repository to your local machine:
```bash
git clone https://github.com/[username]/[EVMRadar-AI].git
cd [EVMRadar-AI]
```

Next, install the required dependencies:
```bash
npm install
```

### 3. Configuration

Set up your environment variables by making a copy of the example file:
```bash
cp .env.example .env
```
Now, open the newly created `.env` file and fill in your secret API keys and configuration details.

### 4. 🎨 Customize Your AI Persona!

This is where the magic happens! Open the `src/persona.ts` file.

Inside this file, you will find the `aiPersona` object. Edit its properties (`name`, `description`, `style`, `rules`, `examples`) to define your bot's unique personality.

### 5. Running the Bot

To start the bot in development mode (with auto-restarting on file changes), run:
```bash
npm run dev
```

For production, you would typically build the project first and then run the JavaScript output:
```bash
npm run build
npm start```

## 📄 License

This project is open-source and proudly licensed under the MIT License.
Copyright (c) 2025 EVM CREW.

See the [LICENSE](LICENSE) file for more details. Feel free to fork, modify, and create a unique bot for your own community!
