
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { RecipeFormValues } from '@/pages/RecipeConverter';

interface TipsSectionProps {
  form: UseFormReturn<RecipeFormValues>;
  control: any;
  errors: any;
}

const TipsSection: React.FC<TipsSectionProps> = ({ form, control, errors }) => {
  // Fix by specifying the exact field type as a generic parameter for both fields
  const { fields: tipFields, append: appendTip, remove: removeTip } = useFieldArray<RecipeFormValues, "tips">({
    control,
    name: "tips"
  });

  const { fields: proTipFields, append: appendProTip, remove: removeProTip } = useFieldArray<RecipeFormValues, "proTips">({
    control,
    name: "proTips"
  });

  return (
    <div className="space-y-8">
      {/* Regular Tips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Tips</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendTip("")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Tip
          </Button>
        </div>
        
        <FormDescription>
          Add helpful tips for beginners.
        </FormDescription>

        <div className="space-y-3">
          {tipFields.map((field, index) => (
            <FormField
              key={field.id}
              control={control}
              name={`tips.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., Let the dough rest for best results" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTip(index)}
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
      
      {/* Pro Tips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Pro Tips</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendProTip("")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Pro Tip
          </Button>
        </div>
        
        <FormDescription>
          Add advanced techniques and insights for experienced bakers.
        </FormDescription>

        <div className="space-y-3">
          {proTipFields.map((field, index) => (
            <FormField
              key={field.id}
              control={control}
              name={`proTips.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., For extra rise, try cold fermentation" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeProTip(index)}
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
    </div>
  );
};

export default TipsSection;
