
import { logError, logInfo } from '@/utils/logger';
import { getOpenAIApiKey } from '@/lib/ai-services/ai-config';
import { ConversionErrorType } from '../types';

export async function makeOpenAIRequest(prompt: string, options = { temperature: 0.3 }) {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    throw new Error('API key not configured');
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a culinary assistant specializing in structuring recipes. ' +
            'Format recipes with clear ingredients, quantities, and step-by-step instructions.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: options.temperature,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'API call failed');
  }

  return response.json();
}
