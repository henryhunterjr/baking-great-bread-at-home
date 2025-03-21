
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Save } from 'lucide-react';
import { RecipeData } from '@/pages/RecipeConverter';
import { useForm, useFieldArray } from 'react-hook-form';
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
  
  // Field arrays for all form sections
  const { 
    fields: ingredientFields, 
    append: appendIngredient, 
    remove: removeIngredient 
  } = useFieldArray<RecipeFormValues>({ 
    control, 
    name: "ingredients" 
  });
  
  const { 
    fields: instructionFields, 
    append: appendInstruction, 
    remove: removeInstruction 
  } = useFieldArray<RecipeFormValues>({ 
    control, 
    name: "instructions" 
  });
  
  const { 
    fields: tipFields, 
    append: appendTip, 
    remove: removeTip 
  } = useFieldArray<RecipeFormValues>({ 
    control, 
    name: "tips" 
  });
  
  const { 
    fields: proTipFields, 
    append: appendProTip, 
    remove: removeProTip 
  } = useFieldArray<RecipeFormValues>({ 
    control, 
    name: "proTips" 
  });
  
  const { 
    fields: equipmentFields, 
    append: appendEquipment, 
    remove: removeEquipment 
  } = useFieldArray<RecipeFormValues>({ 
    control, 
    name: "equipmentNeeded" 
  });
  
  const { 
    fields: tagFields,
    append: appendTag,
    remove: removeTag
  } = useFieldArray<RecipeFormValues>({ 
    control, 
    name: "tags" 
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
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={onCancel}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="default"
                size="sm"
                className="bg-bread-800 hover:bg-bread-900"
                disabled={!isDirty}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Recipe
              </Button>
            </div>
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
            ingredientFields={ingredientFields}
            register={register}
            appendIngredient={appendIngredient}
            removeIngredient={removeIngredient}
            errors={errors}
          />
          
          <Separator />
          
          {/* Instructions */}
          <InstructionsSection 
            instructionFields={instructionFields}
            register={register}
            appendInstruction={appendInstruction}
            removeInstruction={removeInstruction}
            errors={errors}
          />
          
          <Separator />
          
          {/* Tips and Pro Tips */}
          <TipsSection 
            tipFields={tipFields}
            proTipFields={proTipFields}
            register={register}
            appendTip={appendTip}
            removeTip={removeTip}
            appendProTip={appendProTip}
            removeProTip={removeProTip}
          />
          
          <Separator />
          
          {/* Equipment */}
          <EquipmentSection 
            equipmentFields={equipmentFields}
            register={register}
            appendEquipment={appendEquipment}
            removeEquipment={removeEquipment}
            errors={errors}
          />
          
          <Separator />
          
          {/* Tags */}
          <TagsSection 
            tagFields={tagFields}
            control={control}
            appendTag={appendTag}
            removeTag={removeTag}
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
