
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RecipeData } from '@/types/recipeTypes';

interface RecipeFormProps {
  recipeForm: RecipeData;
  updateRecipeForm: (updatedRecipe: RecipeData) => void;
  handleCalculate: () => void;
  isAnalyzing: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  recipeForm,
  updateRecipeForm,
  handleCalculate,
  isAnalyzing
}) => {
  // Add ingredient row
  const addIngredient = () => {
    updateRecipeForm({
      ...recipeForm,
      ingredients: [...recipeForm.ingredients, '']
    });
  };
  
  // Update ingredient
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...recipeForm.ingredients];
    newIngredients[index] = value;
    updateRecipeForm({ ...recipeForm, ingredients: newIngredients });
  };
  
  // Add instruction row
  const addInstruction = () => {
    updateRecipeForm({
      ...recipeForm,
      instructions: [...recipeForm.instructions, '']
    });
  };
  
  // Update instruction
  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...recipeForm.instructions];
    newInstructions[index] = value;
    updateRecipeForm({ ...recipeForm, instructions: newInstructions });
  };
  
  return (
    <div className="space-y-6">
      {/* Recipe Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Recipe Title</label>
        <Input
          value={recipeForm.title}
          onChange={e => updateRecipeForm({ ...recipeForm, title: e.target.value })}
          placeholder="My Bread Recipe"
        />
      </div>
      
      {/* Ingredients */}
      <div>
        <label className="block text-sm font-medium mb-2">Ingredients</label>
        {recipeForm.ingredients.map((ingredient, index) => (
          <div key={index} className="mb-2">
            <Input
              value={typeof ingredient === 'string' ? ingredient : String(ingredient)}
              onChange={e => updateIngredient(index, e.target.value)}
              placeholder="e.g. 500g Bread Flour"
              className="mb-2"
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={addIngredient}
          className="text-xs flex items-center gap-1"
        >
          <Plus className="h-3 w-3" /> Add Ingredient
        </Button>
      </div>
      
      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium mb-2">Instructions</label>
        {recipeForm.instructions.map((instruction, index) => (
          <div key={index} className="mb-2 flex items-center gap-2">
            <span className="font-medium text-sm">{index + 1}.</span>
            <Input
              value={instruction}
              onChange={e => updateInstruction(index, e.target.value)}
              placeholder="Instruction step"
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={addInstruction}
          className="text-xs flex items-center gap-1"
        >
          <Plus className="h-3 w-3" /> Add Step
        </Button>
      </div>
      
      {/* Calculate Button */}
      <Button
        onClick={handleCalculate}
        className="w-full"
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>Processing...</>
        ) : (
          <>Calculate & Analyze Recipe</>
        )}
      </Button>
    </div>
  );
};

export default RecipeForm;
