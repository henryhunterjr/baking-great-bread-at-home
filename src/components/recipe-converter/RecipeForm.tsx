
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RecipeData } from '@/pages/RecipeConverter';
import { useForm, FieldArrayWithId, UseFormRegister, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Import form sections
import BasicInfoSection from './form-sections/BasicInfoSection';
import IngredientsSection from './form-sections/IngredientsSection';
import InstructionsSection from './form-sections/InstructionsSection';
import TipsSection from './form-sections/TipsSection';
import EquipmentSection from './form-sections/EquipmentSection';
import TagsSection from './form-sections/TagsSection';
import FormActions from './form-sections/FormActions';

interface RecipeFormProps {
  initialRecipe: RecipeData;
  onSave: (recipe: RecipeData) => void;
  onCancel: () => void;
}

// Zod schema for form validation
const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  introduction: z.string().optional(),
  ingredients: z.array(z.string().min(1, "Ingredient text is required")),
  prepTime: z.string().optional(),
  restTime: z.string().optional(),
  bakeTime: z.string().optional(),
  totalTime: z.string().optional(),
  instructions: z.array(z.string().min(1, "Instruction text is required")),
  tips: z.array(z.string().optional()),
  proTips: z.array(z.string().optional()),
  equipmentNeeded: z.array(
    z.object({
      name: z.string().min(1, "Equipment name is required"),
      affiliateLink: z.string().optional()
    })
  ),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()),
  isPublic: z.boolean().default(false),
  isConverted: z.boolean().default(true)
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

const RecipeForm: React.FC<RecipeFormProps> = ({ 
  initialRecipe, 
  onSave, 
  onCancel 
}) => {
  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors, isDirty }
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: initialRecipe
  });
  
  const onSubmit = (data: RecipeFormValues) => {
    onSave(data as RecipeData);
  };
  
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-medium">Edit Recipe</h2>
          </div>
          
          <Separator />
          
          {/* Basic Information */}
          <BasicInfoSection 
            register={register} 
            errors={errors} 
          />
          
          <Separator />
          
          {/* Ingredients */}
          <IngredientsSection 
            register={register}
            control={control}
            errors={errors}
          />
          
          <Separator />
          
          {/* Instructions */}
          <InstructionsSection 
            register={register}
            control={control}
            errors={errors}
          />
          
          <Separator />
          
          {/* Tips and Pro Tips */}
          <TipsSection 
            register={register}
            control={control}
          />
          
          <Separator />
          
          {/* Equipment */}
          <EquipmentSection 
            register={register}
            control={control}
            errors={errors}
          />
          
          <Separator />
          
          {/* Tags */}
          <TagsSection 
            control={control}
          />
          
          {/* Form Actions */}
          <FormActions 
            onCancel={onCancel} 
            isDirty={isDirty} 
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default RecipeForm;
