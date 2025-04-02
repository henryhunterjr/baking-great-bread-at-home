
import React, { useState, useEffect } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { logInfo, logError } from '@/utils/logger';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import EditorTabs from '@/components/recipe-converter/form/EditorTabs';
import FormProgress from '@/components/recipe-converter/form/FormProgress';

// If the mobile-optimized form exists, import it instead
let MobileOptimizedRecipeForm: React.FC<any> | null = null;
try {
  MobileOptimizedRecipeForm = require('./MobileOptimizedRecipeForm').default;
} catch (e) {
  // If it doesn't exist, we'll fall back to the regular form
}

interface RecipeFormProps {
  initialRecipe: RecipeData;
  onSave: (recipe: RecipeData) => void;
  onCancel: () => void;
}

const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  introduction: z.string().optional(),
  ingredients: z.array(z.string().min(1, "Ingredient is required")),
  instructions: z.array(z.string().min(1, "Instruction is required")),
  prepTime: z.string().optional(),
  restTime: z.string().optional(),
  bakeTime: z.string().optional(),
  totalTime: z.string().optional(),
  tips: z.array(z.string().optional()),
  proTips: z.array(z.string().optional()),
  equipmentNeeded: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, "Equipment name is required"),
      affiliateLink: z.string().optional()
    })
  ).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  isConverted: z.boolean().default(true) // Default to true
});

const RecipeForm: React.FC<RecipeFormProps> = ({ initialRecipe, onSave, onCancel }) => {
  // Use mobile optimized form if available and we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Fix for isConverted flag - ensure it's properly set
  const preparedRecipe = {
    ...initialRecipe,
    isConverted: true, // Explicitly set to true
    id: initialRecipe.id || crypto.randomUUID()
  };
  
  // Log the prepared recipe to debug save issues
  useEffect(() => {
    logInfo('Prepared recipe for form', {
      hasId: !!preparedRecipe.id,
      hasTitle: !!preparedRecipe.title,
      ingredientsCount: Array.isArray(preparedRecipe.ingredients) ? preparedRecipe.ingredients.length : 0,
      instructionsCount: Array.isArray(preparedRecipe.instructions) ? preparedRecipe.instructions.length : 0,
      isConverted: preparedRecipe.isConverted === true
    });
  }, [preparedRecipe]);
  
  const methods = useForm<RecipeData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: preparedRecipe,
    mode: 'onChange' // Validate on change for better UX feedback
  });
  
  const { handleSubmit, formState: { errors, isDirty, isValid } } = methods;
  
  // debug form state
  useEffect(() => {
    logInfo('Form state:', { 
      errors: Object.keys(errors).length > 0, 
      isDirty, 
      isValid 
    });
  }, [errors, isDirty, isValid]);
  
  const onSubmit = (data: RecipeData) => {
    try {
      // Ensure isConverted flag is set
      const recipeToSave = {
        ...data,
        isConverted: true, // Critical: Always set this to true
        id: data.id || preparedRecipe.id || crypto.randomUUID(),
        updatedAt: new Date().toISOString()
      };
      
      logInfo('Saving recipe from form', {
        hasId: !!recipeToSave.id,
        hasTitle: !!recipeToSave.title,
        ingredientsCount: Array.isArray(recipeToSave.ingredients) ? recipeToSave.ingredients.length : 0,
        instructionsCount: Array.isArray(recipeToSave.instructions) ? recipeToSave.instructions.length : 0,
        isConverted: recipeToSave.isConverted === true
      });
      
      // Call the onSave callback with the updated recipe
      onSave(recipeToSave);
      
      toast({
        title: "Recipe Saved",
        description: "Your recipe has been saved successfully",
      });
    } catch (error) {
      logError('Error saving recipe from form', { error });
      
      toast({
        variant: "destructive",
        title: "Save Error",
        description: "Failed to save recipe. Please try again.",
      });
    }
  };
  
  // Use MobileOptimizedRecipeForm if available and we're on mobile
  if (isMobile && MobileOptimizedRecipeForm) {
    return (
      <MobileOptimizedRecipeForm
        initialRecipe={preparedRecipe}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-medium">Edit Recipe</h2>
                <FormProgress errors={errors} />
              </div>
              
              <EditorTabs initialRecipe={preparedRecipe} />
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={Object.keys(errors).length > 0 || !isValid}
                >
                  Save Recipe
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default RecipeForm;
