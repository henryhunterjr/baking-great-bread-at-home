
import { Recipe } from '@/types/recipe';
import { v4 as uuidv4 } from 'uuid';
import { AI_CONFIG, processRecipeText as processRecipeTextService, generateRecipeFromPrompt } from '@/services/aiService';

/**
 * Process recipe text and convert it to structured recipe data
 */
export const processRecipeText = async (text: string): Promise<Recipe> => {
  try {
    // Call the AI service to process the recipe text
    const processedRecipe = await processRecipeTextService(text);
    
    // Map the processed recipe to our Recipe type
    const ingredients = processedRecipe.ingredients.map(item => {
      // Simple parsing to extract quantity, unit, and name
      const parts = item.trim().split(' ');
      let quantity = '';
      let unit = '';
      let name = '';
      
      if (parts.length > 0) {
        // Try to extract quantity (assume it's the first part)
        if (parts[0].match(/^\d+(\.\d+)?$/) || parts[0].match(/^\d+\/\d+$/)) {
          quantity = parts[0];
          
          // Try to extract unit (assume it's the second part)
          if (parts.length > 1 && parts[1].match(/^[a-zA-Z]+$/)) {
            unit = parts[1];
            name = parts.slice(2).join(' ');
          } else {
            name = parts.slice(1).join(' ');
          }
        } else {
          name = parts.join(' ');
        }
      }
      
      return {
        name,
        quantity,
        unit
      };
    });
    
    // Create structured recipe
    return {
      title: processedRecipe.title,
      description: `A delicious ${processedRecipe.title.toLowerCase()} recipe.`,
      servings: 4,
      prepTime: 30,
      cookTime: 45,
      ingredients,
      steps: processedRecipe.instructions,
      tags: processedRecipe.allergens || [],
      notes: processedRecipe.notes || '',
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
      author: 'AI Assistant',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false
    };
  } catch (error) {
    console.error('Error in processRecipeText:', error);
    throw error;
  }
};

/**
 * Generate a recipe from a prompt
 */
export const generateRecipe = async (prompt: string): Promise<Recipe> => {
  try {
    // Call the AI service to generate a recipe from the prompt
    const generatedRecipe = await generateRecipeFromPrompt(prompt);
    
    // Map the generated recipe to our Recipe type
    const ingredients = generatedRecipe.ingredients.map(item => {
      // Simple parsing to extract quantity, unit, and name
      const parts = item.trim().split(' ');
      let quantity = '';
      let unit = '';
      let name = '';
      
      if (parts.length > 0) {
        // Try to extract quantity (assume it's the first part)
        if (parts[0].match(/^\d+(\.\d+)?$/) || parts[0].match(/^\d+\/\d+$/)) {
          quantity = parts[0];
          
          // Try to extract unit (assume it's the second part)
          if (parts.length > 1 && parts[1].match(/^[a-zA-Z]+$/)) {
            unit = parts[1];
            name = parts.slice(2).join(' ');
          } else {
            name = parts.slice(1).join(' ');
          }
        } else {
          name = parts.join(' ');
        }
      }
      
      return {
        name,
        quantity,
        unit
      };
    });
    
    // Parse cook and prep times to minutes
    const parsePrepTime = (timeStr: string): number => {
      const minutes = parseInt(timeStr.match(/\d+/)?.[0] || '30');
      return minutes;
    };
    
    // Create structured recipe
    return {
      title: generatedRecipe.title,
      description: `A delicious ${generatedRecipe.title.toLowerCase()} recipe generated based on your request.`,
      servings: generatedRecipe.servings || 4,
      prepTime: parsePrepTime(generatedRecipe.prepTime),
      cookTime: parsePrepTime(generatedRecipe.cookTime),
      ingredients,
      steps: generatedRecipe.instructions,
      tags: generatedRecipe.tips ? ['ai-generated'] : [],
      notes: generatedRecipe.tips ? generatedRecipe.tips.join('\n') : '',
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
      author: 'AI Assistant',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false
    };
  } catch (error) {
    console.error('Error in generateRecipe:', error);
    throw error;
  }
};
