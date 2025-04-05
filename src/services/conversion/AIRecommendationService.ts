
import { logError } from '@/utils/logger';
import { AISuggestions } from './types';
import { getOpenAIApiKey } from '@/lib/ai-services/ai-config';

/**
 * Generates AI-powered suggestions for a recipe
 */
export async function generateSuggestions(recipe: any): Promise<AISuggestions> {
  try {
    const apiKey = getOpenAIApiKey();
    
    if (!apiKey) {
      return {
        tips: [],
        improvements: []
      };
    }
    
    // Make OpenAI API call for suggestions
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
            content: 'You are a master bread baker who provides insightful tips and improvements for bread recipes. ' +
              'Provide suggestions in JSON format with "tips", "improvements", and "alternativeMethods" arrays.'
          },
          { 
            role: 'user', 
            content: `Analyze this bread recipe and provide baking suggestions:\n${JSON.stringify(recipe)}` 
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });
    
    if (!response.ok) {
      return getDefaultSuggestions();
    }
    
    const data = await response.json();
    const suggestions = JSON.parse(data.choices[0].message.content);
    
    return {
      tips: suggestions.tips || [],
      improvements: suggestions.improvements || [],
      alternativeMethods: suggestions.alternativeMethods || []
    };
  } catch (error) {
    logError('Failed to generate AI suggestions', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return getDefaultSuggestions();
  }
}

/**
 * Returns default suggestions if AI generation fails
 */
function getDefaultSuggestions(): AISuggestions {
  return {
    tips: [
      'Ensure consistent hydration levels for best results',
      'Monitor fermentation based on dough behavior, not just time'
    ],
    improvements: [
      'Consider adjusting fermentation time based on room temperature',
      'Try scoring the dough differently for better oven spring'
    ]
  };
}
