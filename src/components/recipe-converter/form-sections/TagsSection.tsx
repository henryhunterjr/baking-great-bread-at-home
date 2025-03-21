
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Control, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { RecipeFormValues } from '@/types/recipeTypes';

export interface TagsSectionProps {
  control: Control<RecipeFormValues>;
  watch: UseFormWatch<RecipeFormValues>;
  setValue: UseFormSetValue<RecipeFormValues>;
}

const TagsSection: React.FC<TagsSectionProps> = ({ control, watch, setValue }) => {
  const [tagInput, setTagInput] = React.useState('');
  const tags = watch('tags') || [];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <FormField
      control={control}
      name="tags"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-medium">Tags</FormLabel>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {tags.length === 0 && (
              <div className="text-muted-foreground text-sm italic">
                No tags added yet. Add some tags to categorize your recipe.
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <FormControl>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g., sourdough, beginner-friendly, vegan"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
            </FormControl>
            <Button
              type="button"
              variant="outline"
              onClick={addTag}
              className="whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Tag
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TagsSection;
