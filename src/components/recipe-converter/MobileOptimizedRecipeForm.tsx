import React, { useState, useEffect } from 'react';
import { useBreakpoint } from '@/hooks/use-media-query';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { RecipeData } from '@/types/recipeTypes';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import AccessibilityManager from './accessibility/AccessibilityManager';
import ResponsiveWrapper from './ResponsiveWrapper';
import { InputGroup } from '@/components/ui/mobile-forms';

// Import form sections
import BasicInfoSection from './form-sections/BasicInfoSection';
import IngredientsSection from './form-sections/IngredientsSection';
import InstructionsSection from './form-sections/InstructionsSection';
import TipsSection from './form-sections/TipsSection';
import EquipmentSection from './form-sections/EquipmentSection';
import TagsSection from './form-sections/TagsSection';
import FormActions from './form-sections/FormActions';

interface MobileOptimizedRecipeFormProps {
  initialRecipe: RecipeData;
  onSave: (recipe: RecipeData) => void;
  onCancel: () => void;
}

// Zod schema - keeping the same validation logic as the original
const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  introduction: z.string().optional(),
  ingredients: z.array(z.string().min(1, "Ingredient text is required")),
  prepTime: z.string().optional(),
  restTime: z.string().optional(),
  bakeTime: z.string().optional(),
  totalTime: z.string().optional(),
  instructions: z.array(z.string().min(1, "Instruction text is required")),
  tips: z.array(z.string().optional()).optional(),
  proTips: z.array(z.string().optional()).optional(),
  equipmentNeeded: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Equipment name is required"),
      affiliateLink: z.string().optional()
    })
  ).optional(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
  isConverted: z.boolean().default(true)
});

const MobileOptimizedRecipeForm: React.FC<MobileOptimizedRecipeFormProps> = ({ 
  initialRecipe, 
  onSave, 
  onCancel 
}) => {
  const isMobile = useBreakpoint('smDown');
  const isTablet = useBreakpoint('mdDown');
  
  // Prepare initial recipe data, ensuring equipment items have IDs
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
  
  const formMethods = useForm<RecipeData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: preparedInitialRecipe
  });
  
  const { 
    register, 
    control, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors, isDirty }
  } = formMethods;
  
  const onSubmit = (data: RecipeData) => {
    onSave(data);
  };
  
  // Define responsive classes based on screen size
  const cardPadding = isMobile ? 'pt-4 px-3' : isTablet ? 'pt-5 px-4' : 'pt-6 px-6';
  const sectionSpacing = isMobile ? 'space-y-4' : isTablet ? 'space-y-5' : 'space-y-6';
  
  return (
    <Card className="shadow-md">
      <CardContent className={cardPadding}>
        <FormProvider {...formMethods}>
          <AccessibilityManager>
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className={sectionSpacing}
              aria-label="Recipe edit form"
            >
              <div className="flex items-center justify-between">
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-serif font-medium`}>
                  Edit Recipe
                </h2>
              </div>
              
              <Separator />
              
              <ResponsiveWrapper>
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
              </ResponsiveWrapper>
            </form>
          </AccessibilityManager>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedRecipeForm;
