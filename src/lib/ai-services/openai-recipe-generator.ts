
import { OpenAIRecipeResponse } from '@/components/ai/utils/types';
import { AI_CONFIG, updateOpenAIApiKey } from './ai-config';

/**
 * Generate a recipe using OpenAI
 * @param {string} prompt - Description of the recipe to generate
 * @returns {Promise<OpenAIRecipeResponse>} - Generated recipe
 */
export const generateRecipeWithOpenAI = async (prompt: string): Promise<OpenAIRecipeResponse> => {
  try {
    // Update the OpenAI API key before making the request
    updateOpenAIApiKey();
    
    if (!AI_CONFIG.openai.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a helpful recipe assistant that specializes in bread and baking recipes. 
    Generate a detailed recipe based on the user's request. 
    Focus on providing clear instructions, accurate measurements, and helpful tips.
    Return ONLY JSON in this exact format without any explanation or markdown:
    {
      "recipe": {
        "title": "Recipe Title",
        "description": "Short description of the recipe",
        "ingredients": ["ingredient 1", "ingredient 2", ...],
        "instructions": ["step 1", "step 2", ...],
        "tips": ["tip 1", "tip 2", ...],
        "prepTime": "30 minutes",
        "cookTime": "45 minutes",
        "servings": 4
      }
    }`;

    const response = await fetch(`${AI_CONFIG.openai.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.openai.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a recipe for: ${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const recipeText = data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      const recipeData = JSON.parse(recipeText);
      return recipeData as OpenAIRecipeResponse;
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', recipeText);
      throw new Error('Invalid recipe format returned from OpenAI');
    }
  } catch (error) {
    console.error('Error generating recipe with OpenAI:', error);
    throw error;
  }
};
