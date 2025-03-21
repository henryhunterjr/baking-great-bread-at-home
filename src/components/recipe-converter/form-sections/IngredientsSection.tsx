
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { RecipeFormValues } from '@/pages/RecipeConverter';

interface IngredientsFormSectionProps {
  form: UseFormReturn<RecipeFormValues>;
  control: any;
  errors: any;
}

const IngredientsFormSection: React.FC<IngredientsFormSectionProps> = ({
  form,
  control,
  errors
}) => {
  // Fix by specifying the exact field type as a generic parameter
  const { fields: ingredientFields, append, remove } = useFieldArray<RecipeFormValues, "ingredients">({
    control,
    name: "ingredients"
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Ingredients</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append("")}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Ingredient
        </Button>
      </div>
      
      <FormDescription>
        List all ingredients needed for your recipe.
      </FormDescription>

      <div className="space-y-3">
        {ingredientFields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`ingredients.${index}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="e.g., 500g bread flour" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default IngredientsFormSection;
