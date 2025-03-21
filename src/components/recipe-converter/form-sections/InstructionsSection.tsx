
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { RecipeFormValues } from '@/pages/RecipeConverter';

interface InstructionsSectionProps {
  form: UseFormReturn<RecipeFormValues>;
  control: any;
  errors: any;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({ form, control, errors }) => {
  // Fix by specifying the exact field type as a generic parameter
  const { fields: instructionFields, append, remove } = useFieldArray<RecipeFormValues, "instructions">({
    control,
    name: "instructions"
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Instructions</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append("")}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Step
        </Button>
      </div>
      
      <FormDescription>
        Break down your recipe into clear, step-by-step instructions.
      </FormDescription>

      <div className="space-y-3">
        {instructionFields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`instructions.${index}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <div className="flex-shrink-0 flex items-start pt-2 px-3 bg-muted rounded-md">
                    <span className="font-medium text-sm">{index + 1}</span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder={`Step ${index + 1}: e.g., Mix the flour, water, and salt...`}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                    className="flex-shrink-0"
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

export default InstructionsSection;
