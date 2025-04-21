import { AIConversionService } from './conversion/AIConversionService';
import { Recipe } from '@/types/recipe';
import { RecipeData } from '@/types/recipeTypes';
import { v4 as uuidv4 } from 'uuid';
import { logInfo, logError } from '@/utils/logger';

export interface RawRecipeInput {
  text: string;
  type?: 'bread' | 'general';
  format?: 'structured' | 'unstructured';
}

export async function convertRecipeInput(input: RawRecipeInput): Promise<RecipeData | null> {
  try {
    logInfo('Starting recipe conversion', { inputLength: input.text.length, type: input.type });
    
    const prompt = buildPrompt(input);
    const conversionService = AIConversionService.getInstance();
    
    const result = await conversionService.processRecipeText(input.text, {
      detailed: input.format === 'structured'
    });

    if (!result.success || !result.data) {
      logError('AI conversion failed', { 
        error: result.error?.message,
        type: result.error?.type 
      });
      return null;
    }

    return {
      title: result.data.title || result.data.name, // Use either title or name
      id: uuidv4(),
      ingredients: result.data.ingredients.map(ing => `${ing.quantity} ${ing.unit} ${ing.name}`.trim()),
      instructions: result.data.instructions,
      prepTime: result.data.prepTime,
      cookTime: result.data.cookTime,
      totalTime: result.data.totalTime,
      servings: result.data.servings,
      notes: result.data.notes,
      isConverted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    logError('Recipe conversion error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      inputLength: input.text.length
    });
    return null;
  }
}

function buildPrompt(input: RawRecipeInput): string {
  const basePrompt = `
You are an AI assistant that extracts structured recipe information from user input.

User text:
"${input.text}"

Return a recipe with:
- Title
- Description (if available)
- Ingredients list with quantities
- Step-by-step instructions
- Prep/cook/bake time (if present)

Format the response as a JSON object with these fields.
`.trim();

  // Add specialized instructions based on recipe type
  if (input.type === 'bread') {
    return `${basePrompt}
Also include:
- Hydration percentage
- Flour types and ratios
- Proofing times and temperatures
- Baking temperature and duration`;
  }

  return basePrompt;
}

export async function convertBatch(inputs: RawRecipeInput[]): Promise<RecipeData[]> {
  logInfo('Starting batch conversion', { count: inputs.length });
  
  const results: RecipeData[] = [];

  for (const input of inputs) {
    try {
      const result = await convertRecipeInput(input);
      if (result) {
        results.push(result);
      }
    } catch (error) {
      logError('Error in batch conversion', {
        error: error instanceof Error ? error.message : 'Unknown error',
        inputLength: input.text.length
      });
      // Continue processing other inputs even if one fails
      continue;
    }
  }

  logInfo('Batch conversion complete', { 
    total: inputs.length,
    successful: results.length,
    failed: inputs.length - results.length
  });

  return results;
}
