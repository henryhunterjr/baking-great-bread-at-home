
import { RecipeData } from '@/types/recipeTypes';

/**
 * Parses an AI-generated text response into a structured recipe format
 */
export function parseAIResponseToRecipe(aiResponse: string): RecipeData | null {
  try {
    // Check if the response actually contains recipe content
    if (!aiResponse.includes('Ingredients:') && !aiResponse.includes('Instructions:')) {
      return null;
    }
    
    // Extract title
    let title = "Bread Recipe";
    const titleMatch = aiResponse.match(/(?:^|\n)(.*?)\s*(?:Recipe|Bread)/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }
    
    // Extract ingredients section
    const ingredientsMatch = aiResponse.match(/Ingredients:([\s\S]*?)(?:Instructions:|Method:|Directions:|Preparation:|$)/i);
    const ingredientsText = ingredientsMatch ? ingredientsMatch[1].trim() : "";
    
    // Parse ingredients into array
    const ingredients = ingredientsText.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        // Remove list markers like *, -, •
        return line.replace(/^[-*•]|\s[-*•]\s/g, '').trim();
      });
    
    // Extract instructions section
    const instructionsMatch = aiResponse.match(/(?:Instructions|Method|Directions|Preparation):([\s\S]*?)(?:Notes:|Equipment:|Tips:|$)/i);
    const instructionsText = instructionsMatch ? instructionsMatch[1].trim() : "";
    
    // Parse instructions into array
    const instructions = instructionsText
      .split(/\n(?:\d+[\.\)]\s*|[-*•]\s*)/)
      .filter(line => line.trim() !== '')
      .map(line => line.trim());
    
    // Extract notes section if available
    const notesMatch = aiResponse.match(/Notes:([\s\S]*?)(?:Equipment:|Tips:|$)/i);
    const notesText = notesMatch ? notesMatch[1].trim() : "";
    
    // Parse notes into array
    const notes = notesText.length > 0 ? 
      notesText
        .split(/\n(?:\d+[\.\)]\s*|[-*•]\s*)/)
        .filter(line => line.trim() !== '')
        .map(line => line.trim())
      : [];
    
    // Extract prepTime and cookTime if available
    let prepTime = "";
    let cookTime = "";
    let servings = 1;
    
    const prepTimeMatch = aiResponse.match(/(?:Prep[aration]*\s*Time|Prep):\s*([^\n]+)/i);
    if (prepTimeMatch && prepTimeMatch[1]) {
      prepTime = prepTimeMatch[1].trim();
    }
    
    const cookTimeMatch = aiResponse.match(/(?:Cook(?:ing)*\s*Time|Bake\s*Time):\s*([^\n]+)/i);
    if (cookTimeMatch && cookTimeMatch[1]) {
      cookTime = cookTimeMatch[1].trim();
    }
    
    const servingsMatch = aiResponse.match(/(?:Servings|Yield|Makes):\s*(\d+)/i);
    if (servingsMatch && servingsMatch[1]) {
      servings = parseInt(servingsMatch[1], 10);
    }
    
    // Create recipe object in standard format
    const recipe: RecipeData = {
      title,
      ingredients,
      instructions,
      notes,
      prepTime,
      cookTime,
      servings,
      isConverted: true
    };
    
    return recipe;
  } catch (error) {
    console.error("Error parsing AI response to recipe:", error);
    return null;
  }
}
