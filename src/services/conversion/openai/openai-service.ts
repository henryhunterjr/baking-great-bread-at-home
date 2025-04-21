
import { OpenAI } from "openai";
import { getOpenAIApiKey, isOpenAIConfigured } from "@/lib/ai-services/key-management";
import { logError } from "@/utils/logger";

/**
 * OpenAI integration for converting prompts to structured recipe JSON.
 * Uses the API key from local storage or environment variables.
 */
const createOpenAIClient = () => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add your API key in settings.');
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });
};

/**
 * Makes a request to OpenAI API for structured information
 * @param prompt The text prompt to send to OpenAI
 * @returns The API response data
 */
export async function makeOpenAIRequest(prompt: string) {
  try {
    // Check if API is configured before attempting to create client
    if (!isOpenAIConfigured()) {
      throw new Error('OpenAI API key not configured. Please add your API key in settings.');
    }
    
    const openai = createOpenAIClient();
    
    const res = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that returns recipes ONLY as JSON, no markdown or extra text." },
        { role: "user", content: prompt }
      ],
      // Use GPT-4; fallback to gpt-4o-mini if your key does not have gpt-4 access.
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    return res;
  } catch (error) {
    logError("OpenAI request failed:", { error });
    throw new Error("AI conversion failed. Check API key, response format, and OpenAI status.");
  }
}

// Main function to get a structured recipe from OpenAI
export async function getStructuredRecipe(prompt: string) {
  try {
    const res = await makeOpenAIRequest(prompt);
    const content = res.choices[0]?.message?.content || "";

    // Try to extract JSON from codeblock or raw string
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/i)
      || content.match(/```([\s\S]*?)```/i);
    const jsonText = jsonMatch ? jsonMatch[1] : content;

    try {
      return JSON.parse(jsonText);
    } catch (parseError) {
      // Log for debugging
      logError("Failed to parse OpenAI JSON:", { jsonText });
      // Optionally surface partial/raw response
      throw new Error("AI did not return valid JSON. Raw response: " + content);
    }
  } catch (error) {
    logError("OpenAI request failed:", { error });
    throw new Error("AI conversion failed. Check API key, response format, and OpenAI status.");
  }
}

// Export both named and default exports for compatibility
export default { getStructuredRecipe, makeOpenAIRequest };
