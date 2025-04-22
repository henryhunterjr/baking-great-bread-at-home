
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import ConversionService from './ConversionService';
import RecipeForm from './RecipeForm';
import RecipePreview from './RecipePreview';
import RecipeSuccess from './RecipeSuccess';
import RecipeAIHelper from './RecipeAIHelper';
import { RecipeData } from '@/types/recipeTypes';

interface RecipeConverterContentProps {
  recipe?: RecipeData;
  isEditing: boolean;
  showConversionSuccess: boolean;
  onSetIsEditing: (isEditing: boolean) => void;
  onConversionComplete: (text: string) => void;
  onSaveRecipe: (recipe?: RecipeData) => Promise<boolean>;
  onResetRecipe: () => void;
  updateRecipe: (recipe: RecipeData) => void;
  conversionError: string | null;
}

const RecipeConverterContent: React.FC<RecipeConverterContentProps> = ({
  recipe,
  isEditing,
  showConversionSuccess,
  onSetIsEditing,
  onConversionComplete,
  onSaveRecipe,
  onResetRecipe,
  updateRecipe,
  conversionError
}) => {
  const [isConverting, setIsConverting] = React.useState(false);
  const [activeView, setActiveView] = React.useState<'edit' | 'preview'>('edit');
  
  // Handle conversion process
  const handleConvert = (text: string) => {
    setIsConverting(true);
    onConversionComplete(text);
    setIsConverting(false);
  };
  
  // Toggle between edit and preview modes
  const toggleView = () => {
    setActiveView(activeView === 'edit' ? 'preview' : 'edit');
  };
  
  // Render appropriate content based on state
  const renderContent = () => {
    // Show success screen when conversion is complete
    if (showConversionSuccess && recipe) {
      return <RecipeSuccess onContinue={() => onSetIsEditing(true)} />;
    }
    
    // Show editor when user is editing a recipe
    if (isEditing && recipe) {
      return (
        <Tabs defaultValue={activeView} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="space-x-2">
              <button 
                className={`px-3 py-1 rounded-md ${activeView === 'edit' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                onClick={() => setActiveView('edit')}
              >
                Edit
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${activeView === 'preview' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                onClick={() => setActiveView('preview')}
              >
                Preview
              </button>
            </div>
            <button
              className="text-sm text-muted-foreground underline"
              onClick={onResetRecipe}
            >
              Convert New Recipe
            </button>
          </div>
          
          <TabsContent value="edit">
            <RecipeForm 
              recipe={recipe} 
              onSubmit={(data) => onSaveRecipe(data)} 
              updateRecipe={updateRecipe}
            />
            
            <RecipeAIHelper recipe={recipe} updateRecipe={updateRecipe} />
          </TabsContent>
          
          <TabsContent value="preview">
            <RecipePreview recipe={recipe} />
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-muted rounded-md"
                onClick={() => setActiveView('edit')}
              >
                Back to Editing
              </button>
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                onClick={() => onSaveRecipe(recipe)}
              >
                Save Recipe
              </button>
            </div>
          </TabsContent>
        </Tabs>
      );
    }
    
    // Default to conversion service
    return (
      <ConversionService 
        onConvertRecipe={handleConvert}
        isConverting={isConverting} 
        conversionError={conversionError}
        onReset={onResetRecipe}
        recipe={recipe}
        onSaveRecipe={recipe ? () => onSaveRecipe(recipe) : undefined}
      />
    );
  };
  
  return <div className="space-y-8">{renderContent()}</div>;
};

export default RecipeConverterContent;
