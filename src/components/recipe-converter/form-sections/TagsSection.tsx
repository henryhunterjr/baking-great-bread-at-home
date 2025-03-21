
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { RecipeFormValues } from '@/pages/RecipeConverter';

interface TagsSectionProps {
  form: UseFormReturn<RecipeFormValues>;
  control: any;
  errors: any;
}

const TagsSection: React.FC<TagsSectionProps> = ({ form, control, errors }) => {
  // Fix by specifying the exact field type as a generic parameter
  const { fields: tagFields, append, remove } = useFieldArray<RecipeFormValues, "tags">({
    control,
    name: "tags"
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tags</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append("")}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Tag
        </Button>
      </div>
      
      <FormDescription>
        Add descriptive tags to your recipe to make it easier to find later.
      </FormDescription>

      <div className="space-y-3">
        {tagFields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`tags.${index}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="e.g., sourdough, breakfast, vegan" {...field} />
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

export default TagsSection;
