
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { RecipeData } from '@/types/recipeTypes';

interface BasicInfoSectionProps {
  register: UseFormRegister<RecipeData>;
  errors: FieldErrors<RecipeData>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ 
  register, 
  errors 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium dark:text-white">Basic Information</h3>
      
      <div className="space-y-2">
        <Label htmlFor="title" className="dark:text-gray-300">Recipe Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g., Classic Sourdough Bread"
          className="dark:bg-bread-900 dark:border-bread-700 dark:text-white"
        />
        {errors.title && (
          <p className="text-sm text-red-500 dark:text-red-400">{errors.title.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="introduction" className="dark:text-gray-300">Introduction (Optional)</Label>
        <Textarea
          id="introduction"
          {...register('introduction')}
          placeholder="A brief description or story about this recipe..."
          className="dark:bg-bread-900 dark:border-bread-700 dark:text-white"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prepTime" className="dark:text-gray-300">Prep Time</Label>
          <Input
            id="prepTime"
            {...register('prepTime')}
            placeholder="e.g., 30 minutes"
            className="dark:bg-bread-900 dark:border-bread-700 dark:text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="restTime" className="dark:text-gray-300">Rest/Rise Time</Label>
          <Input
            id="restTime"
            {...register('restTime')}
            placeholder="e.g., 3-4 hours"
            className="dark:bg-bread-900 dark:border-bread-700 dark:text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bakeTime" className="dark:text-gray-300">Bake Time</Label>
          <Input
            id="bakeTime"
            {...register('cookTime')}
            placeholder="e.g., 45 minutes"
            className="dark:bg-bread-900 dark:border-bread-700 dark:text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="totalTime" className="dark:text-gray-300">Total Time</Label>
          <Input
            id="totalTime"
            {...register('totalTime')}
            placeholder="e.g., 12-14 hours"
            className="dark:bg-bread-900 dark:border-bread-700 dark:text-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="dark:text-gray-300">Image URL (Optional)</Label>
        <Input
          id="imageUrl"
          {...register('imageUrl')}
          placeholder="https://example.com/image.jpg"
          className="dark:bg-bread-900 dark:border-bread-700 dark:text-white"
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
