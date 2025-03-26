
import { AI_CONFIG } from './config';
import { generateIngredientsBasedOnPrompt, generateInstructionsBasedOnPrompt } from './helpers';

/**
 * Generate a recipe from a text prompt
 * @param {string} prompt - Description of the recipe to generate
 * @returns {Promise<Object>} - Generated recipe object
 */
export const generateRecipeFromPrompt = async (prompt: string) => {
  try {
    // In a real implementation, this would call your AI API
    // For now, we'll return a simulated response
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // This would be replaced with actual API call:
    /*
    const response = await fetch(`${AI_CONFIG.apiUrl}/generate-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.models.recipeGenerator,
        prompt: prompt,
        options: {
          includeTips: true,
          includeNutrition: true,
          maxInstructions: 10
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
    */
    
    // Determine recipe type from prompt
    const isVegetarian = prompt.toLowerCase().includes('vegetarian');
    const isDessert = prompt.toLowerCase().includes('dessert');
    const isQuick = prompt.toLowerCase().includes('quick') || prompt.toLowerCase().includes('30-minute');
    const isBreakfast = prompt.toLowerCase().includes('breakfast');
    const isGlutenFree = prompt.toLowerCase().includes('gluten-free');
    
    // Generate title based on prompt keywords
    let title = '';
    if (isVegetarian && !isDessert) {
      title = 'Roasted Vegetable Quinoa Bowl';
    } else if (isDessert && isGlutenFree) {
      title = 'Flourless Chocolate Almond Cake';
    } else if (isQuick && !isBreakfast) {
      title = '30-Minute Garlic Butter Shrimp Pasta';
    } else if (isBreakfast) {
      title = 'Protein-Packed Breakfast Bowl';
    } else {
      title = 'Mediterranean Chicken with Roasted Vegetables';
    }
    
    // Simulated response
    return {
      title: title,
      prepTime: isQuick ? '10 minutes' : '20 minutes',
      cookTime: isQuick ? '20 minutes' : '35 minutes',
      servings: 4,
      ingredients: generateIngredientsBasedOnPrompt(prompt),
      instructions: generateInstructionsBasedOnPrompt(prompt),
      tips: [
        isVegetarian ? 'Add tofu or chickpeas for extra protein.' : 'Use free-range, organic chicken for best flavor.',
        isGlutenFree ? 'Ensure all ingredients are certified gluten-free if you have celiac disease.' : 'Serve with crusty bread to soak up the sauce.',
        isQuick ? 'Prep all ingredients before cooking to make the process faster.' : 'This dish can be made ahead and reheated.',
        'Leftovers will keep in the refrigerator for up to 3 days.'
      ],
      nutrition: {
        calories: isVegetarian ? 320 : isDessert ? 390 : 420,
        protein: isVegetarian ? 12 : isDessert ? 8 : 28,
        carbs: isVegetarian ? 45 : isDessert ? 42 : 35,
        fat: isVegetarian ? 14 : isDessert ? 22 : 18
      }
    };
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
};
