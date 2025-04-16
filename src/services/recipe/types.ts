
export interface RecipeStep {
  text: string;
  duration?: string;
  temperature?: string;
  notes?: string[];
}

export interface RawRecipeText {
  title?: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  times?: {
    prep?: string;
    cook?: string;
    bake?: string;
  };
}

export interface ParsedRecipe {
  title: string;
  description?: string;
  ingredients: string[];
  steps: RecipeStep[];
  times?: {
    prep?: string;
    cook?: string;
    bake?: string;
  };
  createdAt: string;
  id: string;
}
