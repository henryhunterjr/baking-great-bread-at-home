
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Control, UseFormWatch, UseFormSetValue, useFieldArray, FieldArrayPath } from 'react-hook-form';
import { RecipeFormValues } from '@/types/recipeTypes';
import { X, Plus, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface TagsSectionProps {
  control: Control<RecipeFormValues>;
  watch: UseFormWatch<RecipeFormValues>;
  setValue: UseFormSetValue<RecipeFormValues>;
}

const TagsSection: React.FC<TagsSectionProps> = ({ 
  control, 
  watch, 
  setValue 
}) => {
  const [tagInput, setTagInput] = useState('');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags' as FieldArrayPath<RecipeFormValues>
  });
  
  const isPublic = watch('isPublic');
  const tags = watch('tags');

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    
    // Convert to lowercase and remove special characters
    const formattedTag = tagInput.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if tag already exists
    if (!tags.includes(formattedTag) && formattedTag) {
      append(formattedTag as any); // Use type assertion to bypass type checking
      setTagInput('');
    }
  };
  
  const commonTags = [
    'sourdough', 'bread', 'artisan', 'traditional', 'vegan', 'glutenfree', 
    'breakfast', 'sandwich', 'dinner', 'beginner', 'advanced', 'quick'
  ];
  
  const handleCommonTagClick = (tag: string) => {
    if (!tags.includes(tag)) {
      append(tag as any); // Use type assertion to bypass type checking
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tags & Visibility</h3>
      
      <form onSubmit={handleAddTag} className="flex space-x-2">
        <div className="relative flex-grow">
          <Hash className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Add a tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button 
          type="submit" 
          size="sm"
          disabled={!tagInput.trim()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </form>
      
      <div className="flex flex-wrap gap-2 min-h-10">
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <Badge 
              key={field.id} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tags[index]}
              <button 
                type="button" 
                className="hover:text-accent-foreground"
                onClick={() => remove(index)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No tags added yet</p>
        )}
      </div>
      
      <div className="mt-2">
        <p className="text-sm text-muted-foreground mb-2">Suggested tags:</p>
        <div className="flex flex-wrap gap-2">
          {commonTags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-secondary"
              onClick={() => handleCommonTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="public-recipe">Make Recipe Public</Label>
          <p className="text-xs text-muted-foreground">
            Share this recipe with the community
          </p>
        </div>
        <Switch 
          id="public-recipe" 
          checked={isPublic}
          onCheckedChange={(checked) => setValue('isPublic', checked)}
        />
      </div>
    </div>
  );
};

export default TagsSection;
