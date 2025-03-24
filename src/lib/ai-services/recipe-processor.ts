import { Recipe } from '@/types/recipe';
import { AI_CONFIG } from './ai-config';
import { StandardRecipe } from '@/types/standardRecipeFormat';

/**
 * Process and structure recipe text using AI
 * @param {string} recipeText - The raw recipe text to process
 * @returns {Promise<Recipe>} - Structured recipe object
 */
export const processRecipeText = async (recipeText: string): Promise<Recipe> => {
  try {
    // Check if the input is a JSON recipe format
    try {
      const jsonRecipe = JSON.parse(recipeText);
      if (jsonRecipe.title && jsonRecipe.ingredients && jsonRecipe.steps) {
        // It's already in our standard JSON format, convert it to Recipe type
        return convertStandardRecipeToRecipe(jsonRecipe as StandardRecipe);
      }
    } catch (e) {
      // Not valid JSON, continue with regular processing
    }
    
    // In a real implementation, this would call your AI API
    // For now, we'll return a simulated response
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // This would be replaced with actual API call:
    /*
    const response = await fetch(`${AI_CONFIG.apiUrl}/process-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.models.recipeProcessor,
        text: recipeText,
        outputFormat: 'standard-json',
        options: {
          extractNutrition: true,
          identifyAllergies: true
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const standardRecipe = await response.json();
    return convertStandardRecipeToRecipe(standardRecipe);
    */
    
    // Detect recipe type from text for better simulation
    const isChocolateRecipe = recipeText.toLowerCase().includes('chocolate');
    const isPastaRecipe = recipeText.toLowerCase().includes('pasta');
    const isSoupRecipe = recipeText.toLowerCase().includes('soup');
    const isSourdoughRecipe = recipeText.toLowerCase().includes('sourdough');
    
    // Simulated response
    return {
      title: isSourdoughRecipe ? 'Artisan Sourdough Bread' :
             isChocolateRecipe ? 'Chocolate Chip Cookies' : 
             isPastaRecipe ? 'Creamy Garlic Pasta' : 
             isSoupRecipe ? 'Hearty Vegetable Soup' : 'Recipe Title',
      description: `A delicious ${isSourdoughRecipe ? 'sourdough bread' :
                   isChocolateRecipe ? 'chocolate chip cookies' : 
                   isPastaRecipe ? 'creamy garlic pasta' : 
                   isSoupRecipe ? 'hearty vegetable soup' : 'recipe'} recipe.`,
      servings: 4,
      prepTime: 30,
      cookTime: 45,
      ingredients: generateIngredientsBasedOnType(recipeText),
      steps: generateStepsBasedOnType(recipeText),
      tags: isSourdoughRecipe ? ['sourdough', 'bread', 'baking'] :
            isChocolateRecipe ? ['dessert', 'baking'] : 
            isPastaRecipe ? ['dinner', 'pasta'] : 
            ['soup', 'lunch'],
      notes: isSourdoughRecipe ? 'For best results, use a Dutch oven to achieve a crispy crust.' :
             isChocolateRecipe ? 'For softer cookies, bake for 9 minutes instead of 11.' : 
             isPastaRecipe ? 'Add grilled chicken or shrimp for a protein boost.' : 
             'This soup freezes well for up to 3 months.',
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
      author: 'AI Assistant',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false
    };
  } catch (error) {
    console.error('Error processing recipe:', error);
    throw error;
  }
};

/**
 * Helper function to convert a StandardRecipe to Recipe type
 */
function convertStandardRecipeToRecipe(standardRecipe: StandardRecipe): Recipe {
  // Extract ingredients from the recipe
  const ingredients = standardRecipe.ingredients.map(ingredient => {
    if (typeof ingredient === 'string') {
      // Parse the string ingredient into parts
      const parts = ingredient.split(' ');
      const quantity = parts[0];
      const unit = parts.length > 2 ? parts[1] : '';
      const name = parts.length > 2 ? parts.slice(2).join(' ') : parts.slice(1).join(' ');
      
      return { name, quantity, unit };
    } else {
      // Use structured ingredient directly
      return {
        name: ingredient.name,
        quantity: ingredient.quantity || '',
        unit: ingredient.unit || ''
      };
    }
  });
  
  // Extract steps from recipe
  const steps = standardRecipe.steps;
  
  // Convert notes to string if it's an array
  const notes = Array.isArray(standardRecipe.notes) 
    ? standardRecipe.notes.join('\n\n') 
    : standardRecipe.notes || '';
  
  return {
    title: standardRecipe.title,
    description: standardRecipe.description || '',
    servings: 4, // Default value since StandardRecipe doesn't have this
    prepTime: standardRecipe.prepTime || 0,
    cookTime: standardRecipe.cookTime || 0,
    ingredients,
    steps,
    tags: standardRecipe.tags || [],
    notes,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
    author: 'Imported Recipe',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false
  };
}

/**
 * Helper function to parse time strings to minutes
 */
function parseTimeToMinutes(timeStr: string): number {
  // Handle simple minute format
  if (timeStr.includes('minute')) {
    return parseInt(timeStr.match(/\d+/)?.[0] || '0');
  }
  
  // Handle hour and minute format
  if (timeStr.includes('hour')) {
    const hours = parseInt(timeStr.match(/(\d+)\s*hour/)?.[1] || '0');
    const minutes = parseInt(timeStr.match(/(\d+)\s*minute/)?.[1] || '0');
    return hours * 60 + minutes;
  }
  
  return 0;
}

/**
 * Helper function to generate ingredients based on recipe type
 */
function generateIngredientsBasedOnType(recipeText: string): {name: string, quantity: string, unit: string}[] {
  const isChocolateRecipe = recipeText.toLowerCase().includes('chocolate');
  const isPastaRecipe = recipeText.toLowerCase().includes('pasta');
  const isSoupRecipe = recipeText.toLowerCase().includes('soup');
  const isSourdoughRecipe = recipeText.toLowerCase().includes('sourdough');
  
  if (isSourdoughRecipe) {
    return [
      { name: 'bread flour', quantity: '500', unit: 'g' },
      { name: 'water', quantity: '375', unit: 'g' },
      { name: 'active sourdough starter', quantity: '100', unit: 'g' },
      { name: 'salt', quantity: '10', unit: 'g' }
    ];
  } else if (isChocolateRecipe) {
    return [
      { name: 'all-purpose flour', quantity: '2', unit: 'cups' },
      { name: 'baking soda', quantity: '1', unit: 'tsp' },
      { name: 'salt', quantity: '1/2', unit: 'tsp' },
      { name: 'unsalted butter, softened', quantity: '3/4', unit: 'cup' },
      { name: 'brown sugar', quantity: '3/4', unit: 'cup' }
    ];
  } else if (isPastaRecipe) {
    return [
      { name: 'pasta', quantity: '8', unit: 'oz' },
      { name: 'garlic, minced', quantity: '3', unit: 'cloves' },
      { name: 'heavy cream', quantity: '1', unit: 'cup' },
      { name: 'grated parmesan', quantity: '1/2', unit: 'cup' },
      { name: 'olive oil', quantity: '2', unit: 'tbsp' }
    ];
  } else {
    return [
      { name: 'onion, diced', quantity: '1', unit: 'large' },
      { name: 'carrots, chopped', quantity: '2', unit: '' },
      { name: 'celery stalks, chopped', quantity: '2', unit: '' },
      { name: 'vegetable broth', quantity: '4', unit: 'cups' },
      { name: 'diced tomatoes', quantity: '1', unit: 'cup' }
    ];
  }
}

/**
 * Helper function to generate steps based on recipe type
 */
function generateStepsBasedOnType(recipeText: string): string[] {
  const isChocolateRecipe = recipeText.toLowerCase().includes('chocolate');
  const isPastaRecipe = recipeText.toLowerCase().includes('pasta');
  const isSoupRecipe = recipeText.toLowerCase().includes('soup');
  const isSourdoughRecipe = recipeText.toLowerCase().includes('sourdough');
  
  if (isSourdoughRecipe) {
    return [
      'Mix flour and water until no dry spots remain. Cover and rest for 30 minutes (autolyse).',
      'Add starter and salt, then perform stretch and folds until dough becomes elastic.',
      'Cover and let rise at room temperature for 3-4 hours, performing stretch and folds every 30 minutes for the first 2 hours.',
      'Shape the dough into a boule or batard and place in a floured banneton.',
      'Refrigerate overnight (8-10 hours) for slow fermentation.',
      'Preheat oven to 500°F (260°C) with Dutch oven inside for 1 hour.',
      'Score dough and bake covered for 20 minutes, then uncovered for 20-25 minutes until deep golden brown.',
      'Cool completely on a wire rack before slicing.'
    ];
  } else if (isChocolateRecipe) {
    return [
      'Preheat oven to 375°F (190°C).',
      'In a small bowl, whisk together the flour, baking soda, and salt.',
      'In a large bowl, cream together the butter, brown sugar, and granulated sugar until light and fluffy.',
      'Beat in eggs one at a time, then stir in vanilla.',
      'Gradually blend in the dry ingredients. Fold in chocolate chips.',
      'Drop by rounded tablespoons onto ungreased baking sheets.',
      'Bake for 9-11 minutes or until golden brown.',
      'Let stand on baking sheet for 2 minutes, then remove to cool on wire racks.'
    ];
  } else if (isPastaRecipe) {
    return [
      'Cook pasta according to package instructions until al dente.',
      'In a skillet, heat olive oil over medium heat. Add minced garlic and sauté until fragrant, about 30 seconds.',
      'Pour in heavy cream and bring to a simmer. Cook for 3-4 minutes until slightly thickened.',
      'Stir in grated parmesan until melted and sauce is smooth.',
      'Drain pasta and add to the sauce. Toss to coat evenly.',
      'Season with salt and pepper to taste.',
      'Garnish with fresh parsley before serving.'
    ];
  } else {
    return [
      'Heat oil in a large pot over medium heat.',
      'Add onions, carrots, and celery. Cook until softened, about 5 minutes.',
      'Add broth, tomatoes, bay leaves, and thyme. Bring to a boil.',
      'Reduce heat and simmer for 20 minutes.',
      'Season with salt and pepper to taste.',
      'Remove bay leaves before serving. Garnish with fresh herbs if desired.'
    ];
  }
}
