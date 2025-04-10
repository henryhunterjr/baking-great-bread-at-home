
import React, { useState, useEffect } from 'react';
import { useBreadAssistant } from '@/contexts/BreadAssistantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { RecipeData } from '@/types/recipeTypes';

import RecipeForm from './baker-calculator/RecipeForm';
import BakersPercentagesDisplay from './baker-calculator/BakersPercentagesDisplay';
import AITipsDisplay from './baker-calculator/AITipsDisplay';
import { calculateBakersPercentages } from './baker-calculator/utils/calculationUtils';

interface ConversionResult {
  bakersPercentages: ReturnType<typeof calculateBakersPercentages>;
  scaledRecipe: RecipeData;
}

const BakersCalculator: React.FC = () => {
  const [recipeForm, setRecipeForm] = useState<RecipeData>({
    title: 'Bread Recipe',
    ingredients: ['500g Bread Flour', '350g Water', '10g Salt', '5g Yeast'],
    instructions: ['Mix ingredients', 'Knead dough', 'Let rise', 'Shape and bake'],
    notes: [],
    isConverted: false,
  });
  
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const { analyzeRecipe, isAnalyzing, lastAnalysisResult, recentSuggestions } = useBreadAssistant();
  
  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle recipe calculation and AI analysis
  const handleCalculate = async () => {
    // Basic calculation
    const bakersPercentages = calculateBakersPercentages(
      recipeForm.ingredients.map(ing => {
        // Handle both string and object formats of ingredients
        if (typeof ing === 'string') {
          const match = ing.match(/(\d+\.?\d*)([a-zA-Z]+)\s+(.+)/);
          if (match) {
            return {
              quantity: parseFloat(match[1]),
              unit: match[2],
              name: match[3]
            };
          }
          return { name: ing, quantity: 0, unit: 'g' };
        } else {
          // Already in object format
          return {
            name: ing.name,
            quantity: parseFloat(ing.quantity) || 0,
            unit: ing.unit
          };
        }
      })
    );
    
    // Set initial result
    setConversionResult({
      bakersPercentages,
      scaledRecipe: recipeForm
    });
    
    // Enhance with AI analysis
    if (bakersPercentages) {
      // Create a copy of the recipe to analyze
      const recipeToAnalyze: RecipeData = { ...recipeForm };
      
      // Pass the recipe to analyze without modifying the RecipeData type
      // The hydration will be extracted from bakersPercentages in the context
      await analyzeRecipe(recipeToAnalyze);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-medium mb-6">Baker's Calculator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipe Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Recipe Input</CardTitle>
          </CardHeader>
          <CardContent>
            <RecipeForm 
              recipeForm={recipeForm}
              updateRecipeForm={setRecipeForm}
              handleCalculate={handleCalculate}
              isAnalyzing={isAnalyzing}
            />
          </CardContent>
        </Card>
        
        {/* Results Panel */}
        <div className="space-y-6">
          {/* Baker's Percentages */}
          {conversionResult && (
            <BakersPercentagesDisplay 
              bakersPercentages={conversionResult.bakersPercentages} 
              ingredients={recipeForm.ingredients}
            />
          )}
          
          {/* AI Assistant Recommendations */}
          {recentSuggestions.length > 0 && (
            <AITipsDisplay 
              suggestions={recentSuggestions}
              hydration={lastAnalysisResult?.hydration}
              fermentationTime={lastAnalysisResult?.fermentationTime}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BakersCalculator;
