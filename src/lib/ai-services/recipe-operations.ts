
import { RecipeData } from '@/types/recipeTypes';
import { logInfo, logError } from '@/utils/logger';
import { getOpenAIApiKey } from './key-management';
import { AI_CONFIG } from './config';

export interface RecipeGenerationResponse {
  success: boolean;
  recipe?: RecipeData;
  error?: string;
}

/**
 * Generate a recipe using OpenAI based on a user prompt
 * @param prompt The recipe generation prompt
 * @returns A response object containing the generated recipe or an error
 */
export const generateRecipeWithOpenAI = async (prompt: string): Promise<RecipeGenerationResponse> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    return {
      success: false,
      error: 'AI service not configured with valid API key'
    };
  }
  
  if (!prompt || prompt.trim() === '') {
    return {
      success: false,
      error: 'No prompt provided for recipe generation'
    };
  }
  
  try {
    logInfo('Generating recipe with OpenAI', { prompt });
    
    // Store original text to preserve it exactly
    const originalText = prompt;
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: AI_CONFIG.openai.model,
          messages: [
            {
              role: 'system',
              content: `You are a professional baker specialized in creating detailed bread recipes. 
              Format your response as a JSON object with the following structure:
              {
                "title": "Recipe name",
                "description": "Brief introduction to the recipe",
                "ingredients": ["ingredient 1", "ingredient 2", ...],
                "steps": ["step 1", "step 2", ...],
                "prepTime": "preparation time in minutes",
                "cookTime": "cooking/baking time in minutes",
                "tips": ["tip 1", "tip 2", ...],
                "tags": ["tag1", "tag2", ...]
              }
              Do not include any explanations or markdown, just the JSON object.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const statusText = response.statusText || 'Unknown error';
        throw new Error(`OpenAI API error (${response.status}): ${statusText}. ${errorData.error?.message || ''}`);
      }
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content returned from OpenAI');
      }
      
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        const recipeData = JSON.parse(jsonString);
        
        const recipe: RecipeData = {
          title: recipeData.title || 'New Recipe',
          // Preserve the original text exactly as the introduction
          introduction: originalText,
          ingredients: recipeData.ingredients || [],
          instructions: recipeData.steps || [],
          prepTime: recipeData.prepTime ? `${recipeData.prepTime} minutes` : '',
          bakeTime: recipeData.cookTime ? `${recipeData.cookTime} minutes` : '',
          totalTime: recipeData.prepTime && recipeData.cookTime ? 
            `${parseInt(recipeData.prepTime) + parseInt(recipeData.cookTime)} minutes` : '',
          tips: recipeData.tips || [],
          proTips: [],
          equipmentNeeded: [],
          imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
          tags: recipeData.tags || [],
          isConverted: true,
          restTime: '',
          isPublic: false
        };
        
        return {
          success: true,
          recipe
        };
      } catch (parseError) {
        logError('Failed to parse OpenAI response:', { error: parseError, content });
        throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
      }
    } catch (apiError) {
      logError('OpenAI API error:', { error: apiError });
      throw new Error(`OpenAI API error: ${apiError.message}`);
    }
  } catch (error) {
    logError('Error generating recipe with OpenAI:', { error });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Process existing recipe text and structure it
 * @param text The raw recipe text to process
 * @returns A response containing the structured recipe or an error
 */
export const processRecipeText = async (text: string): Promise<RecipeGenerationResponse> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    return {
      success: false,
      error: 'AI service not configured with valid API key'
    };
  }
  
  // Store original text to preserve it exactly - this is critical
  const originalText = text;
  
  try {
    logInfo('Processing recipe text with OpenAI', { textLength: text.length });
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_CONFIG.openai.model,
        messages: [
          {
            role: 'system',
            content: `You are a professional chef specialized in structured recipe formatting.
            Format the provided recipe text as a JSON object with the following structure:
            {
              "title": "Recipe name",
              "ingredients": ["ingredient 1", "ingredient 2", ...],
              "steps": ["step 1", "step 2", ...],
              "prepTime": "preparation time in minutes",
              "cookTime": "cooking/baking time in minutes",
              "tips": ["tip 1", "tip 2", ...],
              "tags": ["tag1", "tag2", ...]
            }
            Extract all information accurately from the provided text.
            Do not add any explanations, commentary or markdown, just the JSON object.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }
    
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      const recipeData = JSON.parse(jsonString);
      
      const recipe: RecipeData = {
        id: crypto.randomUUID(), // Always generate a new ID
        title: recipeData.title || 'Untitled Recipe',
        // Preserve the original text exactly as the introduction - CRITICAL
        introduction: originalText,
        ingredients: recipeData.ingredients || [],
        instructions: recipeData.steps || [],
        prepTime: recipeData.prepTime ? `${recipeData.prepTime} minutes` : '',
        cookTime: recipeData.cookTime ? `${recipeData.cookTime} minutes` : '',
        bakeTime: recipeData.bakeTime ? `${recipeData.bakeTime} minutes` : '',
        totalTime: recipeData.totalTime || '',
        servings: recipeData.servings || '',
        difficulty: recipeData.difficulty || '',
        cuisineType: recipeData.cuisineType || '',
        tags: recipeData.tags || [],
        notes: recipeData.notes || [],
        tips: recipeData.tips || [],
        proTips: recipeData.proTips || [],
        equipment: recipeData.equipment || [],
        equipmentNeeded: [],
        isConverted: true, // CRITICAL: Ensure this is explicitly set to true
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        recipe
      };
    } catch (parseError) {
      logError('Failed to parse OpenAI response:', { error: parseError, content });
      throw new Error(`Failed to parse OpenAI response: ${parseError.message}`);
    }
  } catch (error) {
    logError('Error processing recipe text with OpenAI:', { error });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
