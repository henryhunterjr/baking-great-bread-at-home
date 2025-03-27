
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RecipeData } from '@/pages/RecipeConverter';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RecipeFormValues, EquipmentItem } from '@/types/recipeTypes';
import { v4 as uuidv4 } from 'uuid';

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
      id: z.string(),
      name: z.string().min(1, "Equipment name is required"),
      affiliateLink: z.string().optional()
    })
  ),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()),
  isPublic: z.boolean().default(false),
  isConverted: z.boolean().default(true)
});

const RecipeForm: React.FC<RecipeFormProps> = ({ 
  initialRecipe, 
  onSave, 
  onCancel 
}) => {
  // Ensure equipment items have IDs before setting as default values
  const preparedInitialRecipe = {
    ...initialRecipe,
    equipmentNeeded: initialRecipe.equipmentNeeded?.map(item => {
      if (!item.id) {
        return {
          ...item,
          id: uuidv4()
        };
      }
      return item;
    }) || []
  };
  
  const formMethods = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: preparedInitialRecipe as RecipeFormValues
  });
  
  const { 
    register, 
    control, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors, isDirty }
  } = formMethods;
  
  const onSubmit = (data: RecipeFormValues) => {
    onSave(data as RecipeData);
  };
  
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <FormProvider {...formMethods}>
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
              watch={watch}
              setValue={setValue}
            />
            
            {/* Form Actions */}
            <FormActions 
              onCancel={onCancel} 
              isDirty={isDirty} 
            />
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default RecipeForm;
