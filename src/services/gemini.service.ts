// File: src/services/gemini.service.ts 

import { GoogleGenerativeAI } from "@google/generative-ai";
// Impor objek persona lengkap Anda
import { aiPersona } from '../persona';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Gemini API key not found in .env");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateAIComment(buyAmountUSD: number): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // We build highly detailed commands for AI by combining
    // all information from your aiPersona object.
    const prompt = `
      Your instructions are to act as a crypto mascot based on this exact persona:

      **Persona Name:** ${aiPersona.name}
      **Description:** ${aiPersona.description}
      **Writing Style:** ${aiPersona.style}
      **Strict Rules:** ${aiPersona.rules}
      **Examples of your past messages:**
      - ${aiPersona.examples.join('\n- ')}

      ---
      **YOUR TASK:**
      Now, following all the rules and styles of your persona, generate a NEW, UNIQUE, and SHORT comment in ENGLISH for a token purchase of $${buyAmountUSD.toFixed(2)}.

      **FINAL INSTRUCTION: Your entire response must be ONLY the comment itself. No explanations, no options, just the final creative text.**
    `;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Cleaning text of unwanted characters such as asterisks or quotation marks
    return text.replace(/[\*"]/g, '').trim();

  } catch (error) {
    console.error("❌ Failed to generate AI comment:", error);
    return "Another big buy! This rocket is fueled up! 🚀"; 
  }
}
