
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { RecipeData } from '@/types/recipeTypes';
import RecipeAssistant from './RecipeAssistant';
import RecipeSavedList from './RecipeSavedList';
import BreadAssistantPanel from './BreadAssistantPanel';
import BakersCalculator from './BakersCalculator';

interface RecipeConverterSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  recipe: RecipeData;
  onSelectRecipe: (recipe: RecipeData) => void;
  isEditing: boolean;
}

const RecipeConverterSidebar: React.FC<RecipeConverterSidebarProps> = ({
  activeTab,
  onTabChange,
  recipe,
  onSelectRecipe,
  isEditing
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
        <TabsTrigger value="bread">Bread Tips</TabsTrigger>
        <TabsTrigger value="calculator">Calculator</TabsTrigger>
        <TabsTrigger value="favorites" className="relative">
          My Recipes
          {recipe.isConverted && !isEditing && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bread-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-bread-600"></span>
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="assistant" className="mt-4">
        <RecipeAssistant recipe={recipe} />
      </TabsContent>
      <TabsContent value="bread" className="mt-4">
        <BreadAssistantPanel recipe={recipe} />
      </TabsContent>
      <TabsContent value="calculator" className="mt-4">
        <BakersCalculator />
      </TabsContent>
      <TabsContent value="favorites" className="mt-4">
        <RecipeSavedList 
          onSelectRecipe={onSelectRecipe} 
          activeTab={activeTab}
        />
      </TabsContent>
      
      {recipe.isConverted && !isEditing && activeTab === "assistant" && (
        <Alert className="mt-4 bg-muted/50 border-muted">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Your converted recipe is ready! Switch to the "My Recipes" tab to save it to your collection.
          </AlertDescription>
        </Alert>
      )}
    </Tabs>
  );
};

export default RecipeConverterSidebar;
