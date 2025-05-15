
import { ConvertedRecipe, Ingredient } from '@/types/unifiedRecipe';

/**
 * Parses a recipe from text, handling both JSON and structured text formats
 */
export function parseRecipeFromText(text: string): Partial<ConvertedRecipe> {
  // First, try to parse as JSON
  try {
    const jsonData = JSON.parse(text);
    return normalizeRecipe(jsonData);
  } catch (error) {
    // If JSON parsing fails, try to parse as structured text
    return parseStructuredText(text);
  }
}

/**
 * Normalizes a recipe object to ensure it has the expected structure
 */
function normalizeRecipe(recipe: any): Partial<ConvertedRecipe> {
  if (!recipe) return {};
  
  return {
    name: recipe.title || recipe.name || "Untitled Recipe",
    title: recipe.title || recipe.name || "Untitled Recipe",
    description: recipe.description || recipe.introduction || "",
    ingredients: normalizeIngredients(recipe.ingredients || []),
    instructions: Array.isArray(recipe.instructions) 
      ? recipe.instructions 
      : typeof recipe.instructions === 'string' 
        ? recipe.instructions.split('\n').filter(Boolean) 
        : [],
    prepTime: recipe.prepTime || recipe.preparationTime || "",
    cookTime: recipe.cookTime || recipe.cookingTime || "",
    totalTime: recipe.totalTime || "",
    servings: String(recipe.servings || recipe.yield || ""),
    notes: Array.isArray(recipe.notes) 
      ? recipe.notes 
      : typeof recipe.notes === 'string' 
        ? [recipe.notes] 
        : []
  };
}

/**
 * Converts ingredients to a consistent format
 */
function normalizeIngredients(ingredients: any[]): Ingredient[] {
  if (!Array.isArray(ingredients)) {
    return [];
  }
  
  return ingredients.map(ing => {
    if (typeof ing === 'string') {
      // Simple heuristic parsing for string ingredients
      const parts = ing.split(' ');
      const quantity = parts[0] || '';
      const unit = parts.length > 2 ? parts[1] : '';
      const name = parts.length > 2 ? parts.slice(2).join(' ') : parts.slice(1).join(' ');
      
      return { quantity, unit, name };
    } 
    else if (typeof ing === 'object' && ing !== null) {
      // Handle object format ingredients
      return {
        quantity: typeof ing.quantity === 'number' ? String(ing.quantity) : (ing.quantity || ''),
        unit: ing.unit || '',
        name: ing.name || 'Ingredient'
      };
    }
    
    return { quantity: '', unit: '', name: 'Ingredient' };
  });
}

/**
 * Parses structured text into a recipe format
 */
function parseStructuredText(text: string): Partial<ConvertedRecipe> {
  // Basic parsing for structured text
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  let title = "Untitled Recipe";
  const ingredients: string[] = [];
  const instructions: string[] = [];
  const notes: string[] = [];
  
  let currentSection = '';
  
  // Try to extract title from first line
  if (lines.length > 0) {
    title = lines[0].trim();
  }
  
  // Look for section headers and categorize content
  for (const line of lines.slice(1)) {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('ingredient')) {
      currentSection = 'ingredients';
      continue;
    } else if (lowerLine.includes('instruction') || lowerLine.includes('direction')) {
      currentSection = 'instructions';
      continue;
    } else if (lowerLine.includes('note') || lowerLine.includes('tip')) {
      currentSection = 'notes';
      continue;
    }
    
    // Add line to appropriate section
    if (currentSection === 'ingredients') {
      ingredients.push(line.trim());
    } else if (currentSection === 'instructions') {
      instructions.push(line.trim());
    } else if (currentSection === 'notes') {
      notes.push(line.trim());
    }
  }
  
  return {
    title,
    name: title,
    ingredients: normalizeIngredients(ingredients),
    instructions,
    notes
  };
}
