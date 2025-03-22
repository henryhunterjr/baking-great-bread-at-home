
import React from 'react';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import { RecipeFormValues } from '@/types/recipeTypes';

interface IngredientsFormSectionProps {
  control: Control<RecipeFormValues>;
  register: UseFormRegister<RecipeFormValues>;
  errors: Record<string, any>;
}

const IngredientsSection: React.FC<IngredientsFormSectionProps> = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray<RecipeFormValues>({
    control,
    name: "ingredients"
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel className="text-lg font-medium">Ingredients</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append("")}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Ingredient
        </Button>
      </div>

      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`ingredients.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex gap-2">
                  <Input {...field} placeholder={`Ingredient ${index + 1}`} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      {fields.length === 0 && (
        <div className="text-muted-foreground text-sm italic">
          No ingredients added yet. Click "Add Ingredient" to start.
        </div>
      )}
    </div>
  );
};

export default IngredientsSection;
