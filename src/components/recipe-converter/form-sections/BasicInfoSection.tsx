
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { RecipeFormValues } from '@/types/recipeTypes';

interface BasicInfoSectionProps {
  register: UseFormRegister<RecipeFormValues>;
  errors: FieldErrors<RecipeFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ 
  register, 
  errors 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div className="space-y-2">
        <Label htmlFor="title">Recipe Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g., Classic Sourdough Bread"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="introduction">Introduction (Optional)</Label>
        <Textarea
          id="introduction"
          {...register('introduction')}
          placeholder="A brief description or story about this recipe..."
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prepTime">Prep Time</Label>
          <Input
            id="prepTime"
            {...register('prepTime')}
            placeholder="e.g., 30 minutes"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="restTime">Rest/Rise Time</Label>
          <Input
            id="restTime"
            {...register('restTime')}
            placeholder="e.g., 3-4 hours"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bakeTime">Bake Time</Label>
          <Input
            id="bakeTime"
            {...register('bakeTime')}
            placeholder="e.g., 45 minutes"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="totalTime">Total Time</Label>
          <Input
            id="totalTime"
            {...register('totalTime')}
            placeholder="e.g., 12-14 hours"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
        <Input
          id="imageUrl"
          {...register('imageUrl')}
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
