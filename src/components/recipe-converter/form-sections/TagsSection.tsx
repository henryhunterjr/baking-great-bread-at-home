
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { Control, useFieldArray } from 'react-hook-form';
import { RecipeFormValues } from '../RecipeForm';

interface TagsSectionProps {
  control: Control<RecipeFormValues>;
}

const TagsSection: React.FC<TagsSectionProps> = ({
  control
}) => {
  // Remove the generic type parameter as it's causing the error
  const { fields: tagFields, append, remove } = useFieldArray({
    control,
    name: "tags"
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium font-serif">Tags</h3>
        <div className="flex items-center gap-2">
          <Input 
            id="new-tag"
            placeholder="Add a tag..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = e.currentTarget;
                const value = input.value.trim();
                if (value) {
                  append(value);
                  input.value = '';
                }
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.getElementById('new-tag') as HTMLInputElement;
              const value = input.value.trim();
              if (value) {
                append(value);
                input.value = '';
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tagFields.map((field, index) => (
          <div 
            key={field.id} 
            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
          >
            <span>{field.value !== undefined ? field.value : String(field)}</span>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-muted-foreground hover:text-destructive focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {tagFields.length === 0 && (
          <p className="text-sm italic text-muted-foreground">
            No tags added yet
          </p>
        )}
      </div>
    </div>
  );
};

export default TagsSection;
