import { OpenAI } from "openai";

/**
 * OpenAI integration for converting prompts to structured recipe JSON.
 * Uses Vercel-injected environment variable: VITE_OPENAI_API_KEY.
 * 
 * For local dev, see: https://vitejs.dev/guide/env-and-mode.html
 * WARNING: Using OpenAI API in the browser requires an exposed public key. For production, proxy calls through a backend for true secret protection.
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // This exposes your API key in the client bundle!
});

// Main function to get a structured recipe from OpenAI
export async function getStructuredRecipe(prompt: string) {
  try {
    const res = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that returns recipes ONLY as JSON, no markdown or extra text." },
        { role: "user", content: prompt }
      ],
      // Use GPT-4; fallback to gpt-4o-mini if your key does not have gpt-4 access.
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = res.choices[0]?.message?.content || "";

    // Try to extract JSON from codeblock or raw string
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/i)
      || content.match(/```([\s\S]*?)```/i);
    const jsonText = jsonMatch ? jsonMatch[1] : content;

    try {
      return JSON.parse(jsonText);
    } catch (parseError) {
      // Log for debugging
      console.error("Failed to parse OpenAI JSON:", jsonText);
      // Optionally surface partial/raw response
      throw new Error("AI did not return valid JSON. Raw response: " + content);
    }
  } catch (error) {
    console.error("OpenAI request failed:", error);
    throw new Error("AI conversion failed. Check API key, response format, and OpenAI status.");
  }
}

// Optionally keep compat export for system
export default { getStructuredRecipe };
