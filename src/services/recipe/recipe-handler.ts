
import { Recipe } from '@/types/recipe';
import { RawRecipeText, RecipeStep, ParsedRecipe } from './types';
import { logError, logInfo } from '@/utils/logger';

function identifySection(line: string): "none" | "title" | "desc" | "ingredients" | "instructions" {
  if (/^title:/i.test(line)) return "title";
  if (/^description:/i.test(line)) return "desc";
  if (/^ingredients:/i.test(line)) return "ingredients";
  if (/^instructions:/i.test(line)) return "instructions";
  return "none";
}

function cleanLine(line: string, mode: string): string {
  switch (mode) {
    case "title":
    case "desc":
      return line.replace(new RegExp(`^${mode}:`, 'i'), '').trim();
    case "ingredients":
      return line.replace(/^[-*]\s*/, '').trim();
    case "instructions":
      return line.replace(/^\d+\.\s*/, '').trim();
    default:
      return line.trim();
  }
}

export function parseTextToRecipe(rawText: string): ParsedRecipe | null {
  try {
    logInfo('Starting recipe text parsing', { textLength: rawText.length });
    
    const lines = rawText.split("\n").map(line => line.trim()).filter(Boolean);
    
    let title = "";
    let description = "";
    const ingredients: string[] = [];
    const instructions: RecipeStep[] = [];
    
    let mode: "none" | "title" | "desc" | "ingredients" | "instructions" = "none";
    
    for (const line of lines) {
      const newMode = identifySection(line);
      if (newMode !== "none") {
        mode = newMode;
        continue;
      }
      
      switch (mode) {
        case "title":
          title = cleanLine(line, mode);
          break;
        case "desc":
          description = cleanLine(line, mode);
          break;
        case "ingredients":
          if (/^[-*]/.test(line)) {
            ingredients.push(cleanLine(line, mode));
          }
          break;
        case "instructions":
          if (/^\d+\./.test(line)) {
            instructions.push({ text: cleanLine(line, mode) });
          }
          break;
      }
    }
    
    if (!title || ingredients.length === 0 || instructions.length === 0) {
      logError('Incomplete recipe structure', {
        hasTitle: !!title,
        ingredientsCount: ingredients.length,
        instructionsCount: instructions.length
      });
      return null;
    }
    
    const recipe: ParsedRecipe = {
      id: crypto.randomUUID(),
      title,
      description,
      ingredients,
      steps: instructions,
      createdAt: new Date().toISOString()
    };
    
    logInfo('Successfully parsed recipe', {
      title: recipe.title,
      ingredientsCount: recipe.ingredients.length,
      stepsCount: recipe.steps.length
    });
    
    return recipe;
  } catch (error) {
    logError('Failed to parse recipe text', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return null;
  }
}

export function convertToRecipeFormat(parsed: ParsedRecipe): Recipe {
  return {
    title: parsed.title,
    description: parsed.description || '',
    servings: 1, // Default value
    prepTime: 0, // Default value
    ingredients: parsed.ingredients.map(ing => ({
      name: ing,
      quantity: '',
      unit: ''
    })),
    steps: parsed.steps.map(step => step.text),
    tags: [],
    notes: '',
    createdAt: new Date(parsed.createdAt),
    updatedAt: new Date(),
    isPublic: false
  };
}
