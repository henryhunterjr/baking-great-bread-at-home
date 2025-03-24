
export interface StandardRecipeIngredientItem {
  amount: string;
  ingredient: string;
}

export interface StandardRecipeIngredientSection {
  section: string;
  items: StandardRecipeIngredientItem[];
}

export interface StandardRecipeInstructionStep {
  step: number;
  title: string;
  description: string;
}

export interface StandardRecipeMetadata {
  prep_time: string;
  proof_time?: string;
  bake_time: string;
  total_time: string;
  yield: string;
  difficulty: string;
}

export interface StandardRecipe {
  name: string;
  summary: string;
  metadata: StandardRecipeMetadata;
  ingredients: StandardRecipeIngredientSection[];
  equipment: string[];
  instructions: StandardRecipeInstructionStep[];
  notes: string[];
  tags: string[];
}
