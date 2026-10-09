const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: "Hello",
      config: { tools: [{ googleSearch: {} }] }
    });
    console.log("Success text!", res.text);
  } catch(e) {
    console.error("Error text:", e.message);
  }
}
test();
