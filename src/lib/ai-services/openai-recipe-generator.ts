
import { OpenAIRecipeResponse } from '@/components/ai/utils/types';
import { AI_CONFIG } from './ai-config';

/**
 * Generates a recipe using OpenAI based on a given prompt
 * @param prompt Text description of the recipe to generate
 * @returns Generated recipe data
 */
export const generateRecipeWithOpenAI = async (prompt: string): Promise<OpenAIRecipeResponse> => {
  try {
    // For demo/development purposes, simulate a response
    // In production, this would make an API call to OpenAI
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract the recipe name from the prompt
    const recipeName = prompt.includes('for') 
      ? prompt.split('for')[1].trim() 
      : prompt.trim();
      
    // Format title with proper capitalization
    const formattedTitle = recipeName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Check if this is specifically for Henry's cinnamon rolls
    const isHenryCinnamonRolls = 
      prompt.toLowerCase().includes('henry') && 
      prompt.toLowerCase().includes('cinnamon rolls');
    
    if (isHenryCinnamonRolls) {
      return {
        recipe: {
          title: "Henry's Famous Cinnamon Rolls",
          description: "These cinnamon rolls are Henry's signature recipe, featuring a perfectly soft dough with a rich cinnamon-brown sugar filling and topped with a cream cheese frosting.",
          ingredients: [
            "For the dough:",
            "4 cups all-purpose flour",
            "1/3 cup granulated sugar",
            "1 tsp salt",
            "2 1/4 tsp instant yeast (1 packet)",
            "1 cup warm milk (110°F)",
            "1/3 cup unsalted butter, melted",
            "2 large eggs, room temperature",
            
            "For the filling:",
            "3/4 cup packed brown sugar",
            "1/4 cup granulated sugar",
            "2 tbsp ground cinnamon",
            "1/2 cup unsalted butter, softened",
            
            "For the cream cheese frosting:",
            "4 oz cream cheese, softened",
            "1/4 cup unsalted butter, softened",
            "1 1/2 cups powdered sugar",
            "1/2 tsp vanilla extract",
            "Pinch of salt"
          ],
          instructions: [
            "In a large mixing bowl, combine 2 cups of flour, sugar, salt, and yeast.",
            "Add warm milk, melted butter, and eggs. Mix until combined.",
            "Gradually add remaining flour until a soft dough forms.",
            "Knead dough on a floured surface for 5-7 minutes until smooth and elastic.",
            "Place in a greased bowl, cover, and let rise in a warm place for 1 hour or until doubled in size.",
            "While dough is rising, mix brown sugar, granulated sugar, and cinnamon for the filling.",
            "Once dough has risen, roll it out on a floured surface into a 16x12 inch rectangle.",
            "Spread softened butter over the dough, then sprinkle evenly with the cinnamon-sugar mixture.",
            "Starting with the longer side, tightly roll up the dough into a log. Pinch the seam to seal.",
            "Cut the log into 12 equal pieces using a sharp knife or unflavored dental floss.",
            "Place rolls in a greased 9x13 inch baking dish. Cover and let rise for 30 minutes.",
            "Preheat oven to 350°F (175°C). Bake rolls for 25-30 minutes until golden brown.",
            "While rolls are baking, prepare the frosting by beating cream cheese and butter until smooth. Add powdered sugar, vanilla, and salt.",
            "Allow rolls to cool for 5-10 minutes before spreading the frosting on top.",
            "Serve warm and enjoy Henry's signature cinnamon rolls!"
          ],
          tips: [
            "For extra flavor, add 1 tsp of vanilla extract to the dough.",
            "These rolls can be prepared the night before. After cutting and placing in the baking dish, cover and refrigerate overnight. Let come to room temperature for 30 minutes before baking.",
            "For gooey centers, place a small pat of butter on top of each roll before the second rise."
          ],
          prepTime: "30 minutes",
          cookTime: "25-30 minutes",
          servings: 12
        }
      };
    }
    
    // Generate a generic recipe based on the prompt
    return {
      recipe: {
        title: `${formattedTitle}`,
        description: `A delicious homemade recipe for ${recipeName}, featuring Henry's special techniques for perfect texture and flavor every time.`,
        ingredients: [
          // Generate appropriate ingredients based on recipe type
          "Ingredients would be generated based on OpenAI's response",
          "For now, this is a placeholder for demonstration"
        ],
        instructions: [
          "Instructions would be generated based on OpenAI's response",
          "For now, this is a placeholder for demonstration"
        ],
        tips: [
          "In a real implementation, cooking tips would be generated by OpenAI",
          "For proper implementation, you'd need to connect to the OpenAI API"
        ],
        prepTime: "30 minutes",
        cookTime: "45 minutes",
        servings: 4
      }
    };
    
  } catch (error) {
    console.error('Error generating recipe with OpenAI:', error);
    throw error;
  }
};
