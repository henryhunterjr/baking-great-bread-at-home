
import { Recipe } from '@/types/recipe';
import { AI_CONFIG } from './ai-config';
import { generateIngredientsBasedOnPrompt, generateInstructionsBasedOnPrompt } from './recipe-generator-helpers';

/**
 * Generate a recipe from a text prompt
 * @param {string} prompt - Description of the recipe to generate
 * @returns {Promise<Recipe>} - Generated recipe object
 */
export const generateRecipe = async (prompt: string): Promise<Recipe> => {
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
    
    // Parse cook and prep times to minutes
    const parsePrepTime = (timeStr: string): number => {
      const minutes = parseInt(timeStr.match(/\d+/)?.[0] || '30');
      return minutes;
    };
    
    // Get generated items using helper functions
    const rawIngredients = generateIngredientsBasedOnPrompt(prompt);
    const steps = generateInstructionsBasedOnPrompt(prompt);
    
    // Convert raw ingredients to structured format
    const ingredients = rawIngredients.map(item => {
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
    
    // Generate tips
    const tips = [
      isVegetarian ? 'Add tofu or chickpeas for extra protein.' : 'Use free-range, organic chicken for best flavor.',
      isGlutenFree ? 'Ensure all ingredients are certified gluten-free if you have celiac disease.' : 'Serve with crusty bread to soak up the sauce.',
      isQuick ? 'Prep all ingredients before cooking to make the process faster.' : 'This dish can be made ahead and reheated.',
      'Leftovers will keep in the refrigerator for up to 3 days.'
    ];
    
    // Create structured recipe
    return {
      title: title,
      description: `A delicious ${title.toLowerCase()} recipe generated based on your request.`,
      servings: 4,
      prepTime: parsePrepTime(isQuick ? '10 minutes' : '20 minutes'),
      cookTime: parsePrepTime(isQuick ? '20 minutes' : '35 minutes'),
      ingredients,
      steps,
      tags: ['ai-generated'],
      notes: tips.join('\n'),
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
      author: 'AI Assistant',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false
    };
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
};
