
import { isAIConfigured } from '@/lib/ai-services/key-management';
import { logError, logInfo } from '@/utils/logger';
import { makeOpenAIRequest } from './openai/openai-service';
import { buildRecipePrompt } from './prompt/prompt-builder';
import { handleConversionError } from './error/error-handler';
import { parseRecipeFromText } from './utils/recipe-parser';
import { ConversionResult, ConversionErrorType } from './types';
import { generateSuggestions } from './AIRecommendationService';
import { ConvertedRecipe } from '@/types/Recipe';

class AIConversionService {
  private static instance: AIConversionService;
  
  private constructor() {}
  
  public static getInstance(): AIConversionService {
    if (!AIConversionService.instance) {
      AIConversionService.instance = new AIConversionService();
    }
    return AIConversionService.instance;
  }
  
  public hasApiKey(): boolean {
    return isAIConfigured();
  }
  
  public async processRecipeText(
    text: string, 
    options = { detailed: false }
  ): Promise<ConversionResult> {
    if (!this.hasApiKey()) {
      return {
        success: false,
        error: {
          type: ConversionErrorType.UNKNOWN,
          message: 'API key not configured. Please add your OpenAI API key in settings.'
        }
      };
    }
    
    try {
      const prompt = buildRecipePrompt(text, options);
      const response = await makeOpenAIRequest(prompt);
      // Fix the type conversion by adapting the recipe format
      const parsedContent = parseRecipeFromText(response.choices[0].message.content);
      
      if (!parsedContent) {
        throw new Error('Failed to parse recipe from AI response');
      }
      
      // Convert to proper ConvertedRecipe format
      const recipe: ConvertedRecipe = {
        name: parsedContent.title || "Untitled Recipe",
        ingredients: Array.isArray(parsedContent.ingredients) ? 
          parsedContent.ingredients.map(ing => {
            if (typeof ing === 'string') {
              const parts = ing.split(' ');
              const quantity = parts[0];
              const unit = parts.length > 2 ? parts[1] : '';
              const name = parts.length > 2 ? parts.slice(2).join(' ') : parts.slice(1).join(' ');
              return { quantity, unit, name };
            } else if (typeof ing === 'object') {
              return {
                quantity: String(ing.quantity || ''),
                unit: String(ing.unit || ''),
                name: String(ing.name || '')
              };
            }
            return { quantity: '', unit: '', name: 'Ingredient' };
          }) : [],
        instructions: Array.isArray(parsedContent.instructions) ? parsedContent.instructions : [],
        prepTime: parsedContent.prepTime,
        cookTime: parsedContent.cookTime,
        totalTime: parsedContent.totalTime,
        servings: String(parsedContent.servings || ''),
        notes: Array.isArray(parsedContent.notes) ? parsedContent.notes : [],
        title: parsedContent.title // Ensure title is also present
      };
      
      const suggestions = await generateSuggestions(recipe);
      
      return {
        success: true,
        data: recipe,
        aiSuggestions: suggestions
      };
    } catch (error) {
      logError('AI processing error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        textLength: text.length
      });
      
      return {
        success: false,
        error: {
          type: ConversionErrorType.PARSING_ERROR,
          message: error instanceof Error 
            ? error.message 
            : 'Failed to process recipe. Please try a different format.'
        }
      };
    }
  }

  public handleConversionError = handleConversionError;
}

export { AIConversionService, ConversionErrorType };
export type { ConversionResult };
