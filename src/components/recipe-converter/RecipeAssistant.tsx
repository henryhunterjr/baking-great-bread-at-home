
import React from 'react';
import { RecipeData } from '@/types/recipeTypes';
import AIAssistantPanel from '@/components/ai/AIAssistantPanel';
import RecipeGenerator from './generator/RecipeGenerator';

interface RecipeAssistantProps {
  recipe: RecipeData;
}

const RecipeAssistant: React.FC<RecipeAssistantProps> = ({ recipe }) => {
  const handleGenerateRecipe = (generatedRecipe: RecipeData) => {
    // Handle the generated recipe here
    console.log('Generated recipe:', generatedRecipe);
  };
  
  return (
    <div className="space-y-4">
      <AIAssistantPanel recipe={recipe} />
      <RecipeGenerator onGenerateRecipe={handleGenerateRecipe} />
    </div>
  );
};

export default RecipeAssistant;
