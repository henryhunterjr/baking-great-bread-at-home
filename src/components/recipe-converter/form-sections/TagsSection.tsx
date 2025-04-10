
import React from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { RecipeData } from '@/types/recipeTypes';

interface TagsSectionProps {
  control: Control<RecipeData>;
  watch: UseFormWatch<RecipeData>;
  setValue: UseFormSetValue<RecipeData>;
}

const TagsSection: React.FC<TagsSectionProps> = ({ control, watch, setValue }) => {
  const [newTag, setNewTag] = React.useState('');
  const tags = watch('tags') || [];
  
  const suggestedTags = [
    'sourdough', 'bread', 'artisan', 'traditional', 'vegan', 
    'glutenfree', 'breakfast', 'sandwich', 'dinner', 'beginner', 
    'advanced', 'quick'
  ];
  
  const handleAddTag = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue('tags', [...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSuggestedTagClick = (tag: string) => {
    if (!tags.includes(tag)) {
      setValue('tags', [...tags, tag]);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tags & Visibility</h3>
      
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddTag(e);
            }
          }}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={handleAddTag}
          className="bg-bread-700 hover:bg-bread-800"
        >
          Add
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary" 
            className="flex items-center gap-1 px-3 py-1 bg-muted"
          >
            {tag}
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0" 
              onClick={() => handleRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </Button>
          </Badge>
        ))}
      </div>
      
      {tags.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-2">Suggested tags:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.filter(tag => !tags.includes(tag)).slice(0, 8).map(tag => (
              <Badge 
                key={tag}
                variant="outline" 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSuggestedTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2">
        <div>
          <label htmlFor="isPublic" className="font-medium">
            Make Recipe Public
          </label>
          <p className="text-sm text-muted-foreground">
            Share this recipe with the community
          </p>
        </div>
        <input 
          type="checkbox"
          id="isPublic"
          {...control.register('isPublic')}
          className="toggle toggle-primary"
        />
      </div>
    </div>
  );
};

export default TagsSection;
