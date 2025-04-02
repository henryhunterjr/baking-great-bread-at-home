
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';

const IngredientsTab: React.FC = () => {
  const { control } = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients"
  });
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Ingredients</h3>
        <Button
          type="button"
          size="sm"
          onClick={() => append('')}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Ingredient
        </Button>
      </div>
      
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <FormField
            control={control}
            name={`ingredients.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="e.g., 500g bread flour" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
      
      {fields.length === 0 && (
        <div className="text-center p-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No ingredients added yet</p>
          <Button 
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => append('')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Ingredient
          </Button>
        </div>
      )}
    </div>
  );
};

export default IngredientsTab;
