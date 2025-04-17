
import { logInfo, logError } from '@/utils/logger';
import { isOpenAIConfigured, getOpenAIKey } from '@/lib/ai-services/ai-config';

/**
 * Make a request to the OpenAI API for recipe conversion
 */
export const makeOpenAIRequest = async (prompt: string): Promise<any> => {
  try {
    const apiKey = getOpenAIKey();
    
    if (!apiKey || !isOpenAIConfigured()) {
      throw new Error('OpenAI API key not configured');
    }
    
    logInfo('Making OpenAI request', { promptLength: prompt.length });
    
    // Create a prompt that explicitly includes the word "json" for response format compatibility
    const enhancedPrompt = `${prompt}\n\nPlease format your response as valid JSON.`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant that converts recipe text into structured JSON format.' 
          },
          { 
            role: 'user', 
            content: enhancedPrompt 
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      logError('OpenAI API error', { status: response.status, error: errorData });
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    logError('Error in OpenAI request', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
};
