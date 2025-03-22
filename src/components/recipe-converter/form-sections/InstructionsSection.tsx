
import React from 'react';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import { RecipeFormValues } from '@/types/recipeTypes';

interface InstructionsSectionProps {
  control: Control<RecipeFormValues>;
  register: UseFormRegister<RecipeFormValues>;
  errors: Record<string, any>;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "instructions" as any // Type assertion to bypass type check
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel className="text-lg font-medium">Instructions</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append("" as any)} // Type assertion to bypass type check
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Step
        </Button>
      </div>

      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`instructions.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Step {index + 1}</span>
                    </div>
                    <Textarea {...field} placeholder={`Describe step ${index + 1}`} />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="flex-shrink-0 h-10"
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
          No instructions added yet. Click "Add Step" to start.
        </div>
      )}
    </div>
  );
};

export default InstructionsSection;
