
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import { UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId, UseFormRegister } from 'react-hook-form';
import { RecipeFormValues } from '../RecipeForm';

interface IngredientsSectionProps {
  ingredientFields: FieldArrayWithId<RecipeFormValues, "ingredients", "id">[];
  register: UseFormRegister<RecipeFormValues>;
  appendIngredient: UseFieldArrayAppend<RecipeFormValues, "ingredients">;
  removeIngredient: UseFieldArrayRemove;
  errors: Record<string, any>;
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  ingredientFields,
  register,
  appendIngredient,
  removeIngredient,
  errors
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium font-serif">Ingredients</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendIngredient("")}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Ingredient
        </Button>
      </div>
      
      <div className="space-y-3">
        {ingredientFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              {...register(`ingredients.${index}`)}
              placeholder="500g (4 cups) bread flour"
              className={errors.ingredients?.[index] ? "border-destructive" : ""}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeIngredient(index)}
            >
              <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}
        {ingredientFields.length === 0 && (
          <p className="text-sm italic text-muted-foreground">
            No ingredients added yet
          </p>
        )}
      </div>
    </div>
  );
};

export default IngredientsSection;
