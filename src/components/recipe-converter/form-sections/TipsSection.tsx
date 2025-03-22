
import React from 'react';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import { RecipeFormValues } from '@/types/recipeTypes';

interface TipsSectionProps {
  control: Control<RecipeFormValues>;
  register: UseFormRegister<RecipeFormValues>;
}

const TipsSection: React.FC<TipsSectionProps> = ({ control, register }) => {
  const { fields: tipFields, append: appendTip, remove: removeTip } = useFieldArray({
    control,
    name: "tips" as any // Type assertion to bypass type check
  });
  
  const { fields: proTipFields, append: appendProTip, remove: removeProTip } = useFieldArray({
    control,
    name: "proTips" as any // Type assertion to bypass type check
  });

  return (
    <div className="space-y-8">
      {/* Regular Tips */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <FormLabel className="text-lg font-medium">Tips for Beginners</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendTip("" as any)} // Type assertion to bypass type check
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Tip
          </Button>
        </div>

        {tipFields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`tips.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-2">
                    <Textarea {...field} placeholder={`Tip ${index + 1}`} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTip(index)}
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

        {tipFields.length === 0 && (
          <div className="text-muted-foreground text-sm italic">
            No beginner tips added yet. Add some to help new bakers.
          </div>
        )}
      </div>

      {/* Pro Tips */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <FormLabel className="text-lg font-medium">Pro Tips</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendProTip("" as any)} // Type assertion to bypass type check
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Pro Tip
          </Button>
        </div>

        {proTipFields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`proTips.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-2">
                    <Textarea {...field} placeholder={`Pro Tip ${index + 1}`} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProTip(index)}
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

        {proTipFields.length === 0 && (
          <div className="text-muted-foreground text-sm italic">
            No pro tips added yet. Add some advanced techniques.
          </div>
        )}
      </div>
    </div>
  );
};

export default TipsSection;
