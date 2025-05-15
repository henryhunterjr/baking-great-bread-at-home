
import { getOpenAIApiKey } from '@/lib/ai-services/key-management';

/**
 * Makes a request to OpenAI API for structured information
 * @param prompt The text prompt to send to OpenAI
 * @returns The API response data
 */
export async function makeOpenAIRequest(prompt: string) {
  try {
    const apiKey = getOpenAIApiKey();
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please add your API key in settings.');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that converts recipe text into structured JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API returned status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error making OpenAI request:', error);
    throw new Error('Failed to process recipe with AI. Please check your API key and try again.');
  }
}

export default {
  makeOpenAIRequest
};
