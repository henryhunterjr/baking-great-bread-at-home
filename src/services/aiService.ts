
// Configuration for the AI service
export const AI_CONFIG = {
  apiUrl: 'https://api.youraiprovider.com/v1',
  apiKey: process.env.REACT_APP_AI_API_KEY,
  models: {
    recipeProcessor: 'recipe-processor-v1',
    recipeGenerator: 'recipe-generator-v1',
    chatAssistant: 'kitchen-assistant-v1'
  }
};

/**
 * Process and structure recipe text using AI
 * @param {string} recipeText - The raw recipe text to process
 * @returns {Promise<Object>} - Structured recipe object
 */
export const processRecipeText = async (recipeText: string) => {
  try {
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
        options: {
          extractNutrition: true,
          identifyAllergies: true
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
    */
    
    // Detect recipe type from text for better simulation
    const isChocolateRecipe = recipeText.toLowerCase().includes('chocolate');
    const isPastaRecipe = recipeText.toLowerCase().includes('pasta');
    const isSoupRecipe = recipeText.toLowerCase().includes('soup');
    
    // Simulated response
    return {
      title: isChocolateRecipe ? 'Chocolate Chip Cookies' : 
             isPastaRecipe ? 'Creamy Garlic Pasta' : 
             isSoupRecipe ? 'Hearty Vegetable Soup' : 'Recipe Title',
      ingredients: [
        isChocolateRecipe ? '2 cups all-purpose flour' : isPastaRecipe ? '8 oz pasta' : '1 large onion, diced',
        isChocolateRecipe ? '1 tsp baking soda' : isPastaRecipe ? '3 cloves garlic, minced' : '2 carrots, chopped',
        isChocolateRecipe ? '1/2 tsp salt' : isPastaRecipe ? '1 cup heavy cream' : '2 celery stalks, chopped',
        isChocolateRecipe ? '3/4 cup unsalted butter, softened' : isPastaRecipe ? '1/2 cup grated parmesan' : '4 cups vegetable broth',
        isChocolateRecipe ? '3/4 cup brown sugar' : isPastaRecipe ? '2 tbsp olive oil' : '1 cup diced tomatoes',
        isChocolateRecipe ? '3/4 cup granulated sugar' : isPastaRecipe ? 'Salt and pepper to taste' : '2 bay leaves',
        isChocolateRecipe ? '2 large eggs' : isPastaRecipe ? '1/4 cup fresh parsley, chopped' : 'Salt and pepper to taste',
        isChocolateRecipe ? '2 tsp vanilla extract' : '', '1 tsp dried thyme',
        isChocolateRecipe ? '2 cups chocolate chips' : '', ''
      ].filter(Boolean),
      instructions: [
        isChocolateRecipe ? 'Preheat oven to 375°F (190°C).' : 
        isPastaRecipe ? 'Cook pasta according to package instructions until al dente.' : 
        'Heat oil in a large pot over medium heat.',
        
        isChocolateRecipe ? 'In a small bowl, whisk together the flour, baking soda, and salt.' : 
        isPastaRecipe ? 'In a skillet, heat olive oil over medium heat. Add minced garlic and sauté until fragrant, about 30 seconds.' : 
        'Add onions, carrots, and celery. Cook until softened, about 5 minutes.',
        
        isChocolateRecipe ? 'In a large bowl, cream together the butter, brown sugar, and granulated sugar until light and fluffy.' : 
        isPastaRecipe ? 'Pour in heavy cream and bring to a simmer. Cook for 3-4 minutes until slightly thickened.' : 
        'Add broth, tomatoes, bay leaves, and thyme. Bring to a boil.',
        
        isChocolateRecipe ? 'Beat in eggs one at a time, then stir in vanilla.' : 
        isPastaRecipe ? 'Stir in grated parmesan until melted and sauce is smooth.' : 
        'Reduce heat and simmer for 20 minutes.',
        
        isChocolateRecipe ? 'Gradually blend in the dry ingredients. Fold in chocolate chips.' : 
        isPastaRecipe ? 'Drain pasta and add to the sauce. Toss to coat evenly.' : 
        'Season with salt and pepper to taste.',
        
        isChocolateRecipe ? 'Drop by rounded tablespoons onto ungreased baking sheets.' : 
        isPastaRecipe ? 'Garnish with fresh parsley before serving.' : 
        'Remove bay leaves before serving. Garnish with fresh herbs if desired.'
      ],
      notes: isChocolateRecipe ? 'For softer cookies, bake for 9 minutes instead of 11.' : 
             isPastaRecipe ? 'Add grilled chicken or shrimp for a protein boost.' : 
             'This soup freezes well for up to 3 months.',
      nutrition: {
        calories: isChocolateRecipe ? 210 : isPastaRecipe ? 450 : 120,
        protein: isChocolateRecipe ? 2 : isPastaRecipe ? 12 : 3,
        carbs: isChocolateRecipe ? 30 : isPastaRecipe ? 52 : 18,
        fat: isChocolateRecipe ? 10 : isPastaRecipe ? 22 : 4
      },
      allergens: isChocolateRecipe ? ['wheat', 'dairy', 'eggs'] : 
                isPastaRecipe ? ['wheat', 'dairy'] : []
    };
  } catch (error) {
    console.error('Error processing recipe:', error);
    throw error;
  }
};

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

/**
 * Helper function to generate simulated ingredients based on prompt
 */
function generateIngredientsBasedOnPrompt(prompt: string): string[] {
  const isVegetarian = prompt.toLowerCase().includes('vegetarian');
  const isDessert = prompt.toLowerCase().includes('dessert');
  const isQuick = prompt.toLowerCase().includes('quick') || prompt.toLowerCase().includes('30-minute');
  const isBreakfast = prompt.toLowerCase().includes('breakfast');
  const isGlutenFree = prompt.toLowerCase().includes('gluten-free');
  
  if (isVegetarian && !isDessert) {
    return [
      '1 cup quinoa, rinsed',
      '2 cups vegetable broth',
      '1 red bell pepper, diced',
      '1 zucchini, diced',
      '1 small eggplant, diced',
      '1 red onion, diced',
      '3 tablespoons olive oil',
      '2 cloves garlic, minced',
      '1 teaspoon dried oregano',
      '1/2 teaspoon cumin',
      'Salt and pepper to taste',
      '1/4 cup fresh parsley, chopped',
      '2 tablespoons lemon juice',
      'Optional: 1/2 cup crumbled feta cheese'
    ];
  } else if (isDessert && isGlutenFree) {
    return [
      '200g dark chocolate (70% cocoa)',
      '200g unsalted butter',
      '1 cup almond flour',
      '1 cup granulated sugar',
      '6 large eggs',
      '1 teaspoon vanilla extract',
      '1/2 teaspoon salt',
      '2 tablespoons cocoa powder',
      'Powdered sugar for dusting'
    ];
  } else if (isQuick && !isBreakfast) {
    return [
      '8 oz pasta',
      '1 lb large shrimp, peeled and deveined',
      '4 tablespoons butter',
      '4 cloves garlic, minced',
      '1/2 teaspoon red pepper flakes',
      '1/4 cup white wine',
      '2 tablespoons lemon juice',
      '2 tablespoons fresh parsley, chopped',
      'Salt and pepper to taste',
      'Grated Parmesan for serving'
    ];
  } else if (isBreakfast) {
    return [
      '2 eggs',
      '1/2 cup cooked quinoa',
      '1/2 avocado, sliced',
      '1/4 cup black beans, rinsed and drained',
      '2 tablespoons salsa',
      '2 tablespoons Greek yogurt',
      '1 tablespoon olive oil',
      'Salt and pepper to taste',
      'Hot sauce to taste'
    ];
  } else {
    return [
      '4 boneless, skinless chicken breasts',
      '2 tablespoons olive oil',
      '1 tablespoon dried oregano',
      '1 tablespoon dried thyme',
      '1 teaspoon paprika',
      '4 cloves garlic, minced',
      '1 zucchini, sliced',
      '1 red bell pepper, sliced',
      '1 yellow bell pepper, sliced',
      '1 red onion, sliced',
      '1 cup cherry tomatoes',
      '1/2 cup kalamata olives',
      '1/4 cup feta cheese, crumbled',
      'Salt and pepper to taste',
      '2 tablespoons fresh lemon juice',
      '2 tablespoons fresh parsley, chopped'
    ];
  }
}

/**
 * Helper function to generate simulated instructions based on prompt
 */
function generateInstructionsBasedOnPrompt(prompt: string): string[] {
  const isVegetarian = prompt.toLowerCase().includes('vegetarian');
  const isDessert = prompt.toLowerCase().includes('dessert');
  const isQuick = prompt.toLowerCase().includes('quick') || prompt.toLowerCase().includes('30-minute');
  const isBreakfast = prompt.toLowerCase().includes('breakfast');
  
  if (isVegetarian && !isDessert) {
    return [
      'Preheat oven to 425°F (220°C).',
      'In a medium saucepan, combine quinoa and vegetable broth. Bring to a boil, then reduce heat to low, cover, and simmer for 15 minutes until liquid is absorbed.',
      'On a large baking sheet, toss the diced bell pepper, zucchini, eggplant, and red onion with 2 tablespoons olive oil, garlic, oregano, cumin, salt, and pepper.',
      'Roast vegetables for 20-25 minutes, stirring halfway through, until tender and lightly browned.',
      'Fluff the cooked quinoa with a fork and transfer to a large bowl.',
      'Add the roasted vegetables to the quinoa. Drizzle with remaining olive oil and lemon juice, then add parsley.',
      'Gently toss to combine. Taste and adjust seasoning if needed.',
      'If using, sprinkle with crumbled feta cheese before serving.'
    ];
  } else if (isDessert) {
    return [
      'Preheat oven to 350°F (175°C). Grease a 9-inch springform pan and line the bottom with parchment paper.',
      'In a heatproof bowl over simmering water, melt the chocolate and butter together, stirring occasionally until smooth.',
      'Remove from heat and let cool slightly.',
      'In a large bowl, whisk together the almond flour, sugar, and salt.',
      'In another bowl, beat the eggs and vanilla until frothy.',
      'Gradually add the chocolate mixture to the eggs, whisking constantly.',
      'Fold the chocolate mixture into the dry ingredients until well combined.',
      'Pour the batter into the prepared pan and smooth the top.',
      'Bake for 35-40 minutes until the center is set but still slightly fudgy.',
      'Let cool in the pan for 10 minutes, then remove the sides of the springform pan.',
      'When completely cool, dust with cocoa powder and powdered sugar.'
    ];
  } else if (isQuick) {
    return [
      'Cook pasta according to package instructions. Reserve 1/2 cup of pasta water before draining.',
      'While pasta cooks, pat shrimp dry with paper towels and season with salt and pepper.',
      'In a large skillet, melt 2 tablespoons of butter over medium-high heat.',
      'Add shrimp and cook for 1-2 minutes per side until pink and opaque. Remove to a plate.',
      'In the same skillet, add remaining butter, garlic, and red pepper flakes. Cook for 30 seconds until fragrant.',
      'Add white wine and lemon juice, scraping up any browned bits from the pan. Simmer for 2 minutes.',
      'Return shrimp to the skillet and add drained pasta. Toss to coat in the sauce.',
      'If needed, add a splash of reserved pasta water to loosen the sauce.',
      'Garnish with fresh parsley and serve with grated Parmesan.'
    ];
  } else if (isBreakfast) {
    return [
      'Heat olive oil in a small non-stick skillet over medium heat.',
      'Crack eggs into the skillet and cook to your preference (sunny-side up, over easy, or scrambled).',
      'In a bowl, layer the cooked quinoa as the base.',
      'Top with eggs, sliced avocado, and black beans.',
      'Dollop Greek yogurt and salsa on top.',
      'Season with salt and pepper.',
      'Add hot sauce if desired.',
      'Serve immediately while warm.'
    ];
  } else {
    return [
      'Preheat oven to 400°F (200°C).',
      'In a small bowl, mix together oregano, thyme, paprika, half of the minced garlic, 1 tablespoon olive oil, salt, and pepper.',
      'Place chicken breasts on a cutting board and brush with the herb mixture on both sides.',
      'In a large baking dish or sheet pan, toss zucchini, bell peppers, onion, cherry tomatoes, and remaining garlic with 1 tablespoon olive oil, salt, and pepper.',
      'Arrange the chicken breasts on top of the vegetables.',
      'Bake for 25-30 minutes, or until chicken reaches an internal temperature of 165°F (74°C) and vegetables are tender.',
      'Sprinkle olives over the dish in the last 5 minutes of cooking.',
      'Remove from oven and let rest for 5 minutes.',
      'Sprinkle with crumbled feta cheese, fresh lemon juice, and chopped parsley before serving.'
    ];
  }
}
