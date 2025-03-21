
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Image } from 'lucide-react';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { RecipeFormValues } from '../RecipeForm';

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
      <h3 className="text-lg font-medium font-serif">Basic Information</h3>
      
      <div className="space-y-2">
        <Label htmlFor="title">Recipe Title</Label>
        <Input
          id="title"
          {...register("title")}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="introduction">
          Introduction <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="introduction"
          {...register("introduction")}
          placeholder="Share the story behind this recipe..."
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="space-y-2">
          <Label htmlFor="prepTime" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Prep Time
          </Label>
          <Input
            id="prepTime"
            {...register("prepTime")}
            placeholder="30 min"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="restTime" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Rest Time
          </Label>
          <Input
            id="restTime"
            {...register("restTime")}
            placeholder="2 hours"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bakeTime" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Bake Time
          </Label>
          <Input
            id="bakeTime"
            {...register("bakeTime")}
            placeholder="45 min"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="totalTime" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Total Time
          </Label>
          <Input
            id="totalTime"
            {...register("totalTime")}
            placeholder="3 hours"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="flex items-center">
          <Image className="h-3 w-3 mr-1" />
          Recipe Image URL
        </Label>
        <Input
          id="imageUrl"
          {...register("imageUrl")}
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-muted-foreground">
          Enter a URL for the recipe image or leave as is for a placeholder
        </p>
      </div>
    </div>
  );
};

export default BasicInfoSection;
