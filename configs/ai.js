// configs/ai.js
const OpenAI = require("openai");

const ai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

module.exports = ai;
