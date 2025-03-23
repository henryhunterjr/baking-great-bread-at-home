
import { Recipe } from '@/types/recipe';

/**
 * Helper function to generate simulated ingredients based on prompt
 * Note: This is only used as a fallback if the OpenAI API is not configured
 */
export const generateIngredientsBasedOnPrompt = (prompt: string): string[] => {
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
};

/**
 * Helper function to generate simulated instructions based on prompt
 * Note: This is only used as a fallback if the OpenAI API is not configured
 */
export const generateInstructionsBasedOnPrompt = (prompt: string): string[] => {
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
};
