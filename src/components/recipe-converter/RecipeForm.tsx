
import React from 'react';
import { RecipeData } from '@/types/recipeTypes';

interface RecipeFormProps {
  initialData: RecipeData;
  onSubmit: (data: RecipeData) => Promise<boolean>;
  updateRecipe: (recipe: RecipeData) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ initialData, onSubmit, updateRecipe }) => {
  const [formData, setFormData] = React.useState<RecipeData>(initialData);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    updateRecipe({ ...formData, [name]: value });
  };
  
  // Handle ingredient changes
  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: updatedIngredients }));
    updateRecipe({ ...formData, ingredients: updatedIngredients });
  };
  
  // Add new ingredient
  const addIngredient = () => {
    const updatedIngredients = [...formData.ingredients, ''];
    setFormData(prev => ({ ...prev, ingredients: updatedIngredients }));
    updateRecipe({ ...formData, ingredients: updatedIngredients });
  };
  
  // Remove ingredient
  const removeIngredient = (index: number) => {
    const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, ingredients: updatedIngredients }));
    updateRecipe({ ...formData, ingredients: updatedIngredients });
  };
  
  // Handle instruction changes
  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index] = value;
    setFormData(prev => ({ ...prev, instructions: updatedInstructions }));
    updateRecipe({ ...formData, instructions: updatedInstructions });
  };
  
  // Add new instruction
  const addInstruction = () => {
    const updatedInstructions = [...formData.instructions, ''];
    setFormData(prev => ({ ...prev, instructions: updatedInstructions }));
    updateRecipe({ ...formData, instructions: updatedInstructions });
  };
  
  // Remove instruction
  const removeInstruction = (index: number) => {
    const updatedInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, instructions: updatedInstructions }));
    updateRecipe({ ...formData, instructions: updatedInstructions });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Recipe Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
          />
        </div>
        
        <div>
          <label htmlFor="introduction" className="block text-sm font-medium mb-1">Introduction</label>
          <textarea
            id="introduction"
            name="introduction"
            value={formData.introduction || ''}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 h-24"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="prepTime" className="block text-sm font-medium mb-1">Prep Time</label>
            <input
              type="text"
              id="prepTime"
              name="prepTime"
              value={formData.prepTime || ''}
              onChange={handleChange}
              placeholder="e.g. 15 minutes"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="cookTime" className="block text-sm font-medium mb-1">Cook Time</label>
            <input
              type="text"
              id="cookTime"
              name="cookTime"
              value={formData.cookTime || ''}
              onChange={handleChange}
              placeholder="e.g. 45 minutes"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="totalTime" className="block text-sm font-medium mb-1">Total Time</label>
            <input
              type="text"
              id="totalTime"
              name="totalTime"
              value={formData.totalTime || ''}
              onChange={handleChange}
              placeholder="e.g. 1 hour"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
        </div>
      </div>
      
      {/* Ingredients */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Ingredients</h3>
          <button 
            type="button"
            onClick={addIngredient}
            className="text-sm px-2 py-1 border rounded-md hover:bg-muted"
          >
            + Add Ingredient
          </button>
        </div>
        
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-start gap-2">
            <input
              type="text"
              value={typeof ingredient === 'string' ? ingredient : `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="flex-grow rounded-md border border-input bg-background px-3 py-2"
              placeholder="e.g. 2 cups all-purpose flour"
            />
            <button 
              type="button"
              onClick={() => removeIngredient(index)}
              className="text-sm px-2 py-1 border rounded-md hover:bg-muted text-destructive"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      {/* Instructions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Instructions</h3>
          <button 
            type="button"
            onClick={addInstruction}
            className="text-sm px-2 py-1 border rounded-md hover:bg-muted"
          >
            + Add Step
          </button>
        </div>
        
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="mt-2 mr-2 text-sm font-medium">{index + 1}.</div>
            <textarea
              value={instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              className="flex-grow rounded-md border border-input bg-background px-3 py-2 h-24"
              placeholder="Describe this step..."
            />
            <button 
              type="button"
              onClick={() => removeInstruction(index)}
              className="text-sm px-2 py-1 border rounded-md hover:bg-muted text-destructive"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button 
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Save Recipe
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
