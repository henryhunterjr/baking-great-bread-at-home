
import React, { useState, useEffect } from 'react';
import { useBreadAssistant } from '@/contexts/BreadAssistantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calculator, Loader2 } from 'lucide-react';
import { RecipeData } from '@/types/recipeTypes';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface BakersPercentages {
  percentages: Array<{ name: string; percentage: number }>;
  hydration: number;
  totalFlourWeight: number;
}

const BakersCalculator: React.FC = () => {
  const [recipeForm, setRecipeForm] = useState<RecipeData>({
    title: 'Bread Recipe',
    ingredients: ['500g Bread Flour', '350g Water', '10g Salt', '5g Yeast'],
    instructions: ['Mix ingredients', 'Knead dough', 'Let rise', 'Shape and bake'],
    notes: [],
    isConverted: false,
  });
  
  const [conversionResult, setConversionResult] = useState<{
    bakersPercentages: BakersPercentages | null;
    scaledRecipe: RecipeData;
  } | null>(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const { analyzeRecipe, isAnalyzing, lastAnalysisResult, recentSuggestions } = useBreadAssistant();
  
  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Parse ingredients to structured format for internal use
  const parseIngredients = (): Ingredient[] => {
    return recipeForm.ingredients.map(ing => {
      const ingredientStr = typeof ing === 'string' ? ing : String(ing);
      
      // Simple parsing logic - can be enhanced
      const match = ingredientStr.match(/(\d+\.?\d*)([a-zA-Z]+)\s+(.+)/);
      if (match) {
        return {
          quantity: parseFloat(match[1]),
          unit: match[2],
          name: match[3]
        };
      }
      return { name: ingredientStr, quantity: 0, unit: 'g' };
    });
  };
  
  // Add ingredient row
  const addIngredient = () => {
    setRecipeForm(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };
  
  // Update ingredient
  const updateIngredient = (index: number, value: string) => {
    setRecipeForm(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = value;
      return { ...prev, ingredients: newIngredients };
    });
  };
  
  // Add instruction row
  const addInstruction = () => {
    setRecipeForm(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };
  
  // Update instruction
  const updateInstruction = (index: number, value: string) => {
    setRecipeForm(prev => {
      const newInstructions = [...prev.instructions];
      newInstructions[index] = value;
      return { ...prev, instructions: newInstructions };
    });
  };
  
  // Calculate baker's percentages
  const calculateBakersPercentages = (): BakersPercentages | null => {
    const ingredients = parseIngredients();
    
    // Get total flour weight
    const flourItems = ingredients.filter(i => 
      i.name.toLowerCase().includes('flour')
    );
    
    const flourWeight = flourItems.reduce((sum, i) => sum + i.quantity, 0);
    
    if (flourWeight === 0) return null;
    
    // Calculate percentages
    const percentages = ingredients.map(ingredient => ({
      name: ingredient.name,
      percentage: Math.round((ingredient.quantity / flourWeight) * 1000) / 10
    }));
    
    // Calculate hydration
    const waterItems = ingredients.filter(i => 
      i.name.toLowerCase().includes('water') || 
      i.name.toLowerCase().includes('milk') || 
      i.name.toLowerCase() === 'liquid'
    );
    
    const waterWeight = waterItems.reduce((sum, i) => sum + i.quantity, 0);
    
    const hydration = Math.round((waterWeight / flourWeight) * 1000) / 10;
    
    return {
      percentages,
      hydration,
      totalFlourWeight: flourWeight
    };
  };
  
  // Handle recipe calculation and AI analysis
  const handleCalculate = async () => {
    // Basic calculation
    const bakersPercentages = calculateBakersPercentages();
    
    // Set initial result
    setConversionResult({
      bakersPercentages,
      scaledRecipe: recipeForm
    });
    
    // Enhance with AI analysis
    if (bakersPercentages) {
      await analyzeRecipe({
        ...recipeForm,
        // Pass hydration as a separate parameter rather than trying to add it to RecipeData
        hydration: bakersPercentages.hydration
      });
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
          <CardContent className="space-y-6">
            {/* Recipe Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Recipe Title</label>
              <Input
                value={recipeForm.title}
                onChange={e => setRecipeForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="My Bread Recipe"
              />
            </div>
            
            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium mb-2">Ingredients</label>
              {recipeForm.ingredients.map((ingredient, index) => (
                <div key={index} className="mb-2">
                  <Input
                    value={typeof ingredient === 'string' ? ingredient : String(ingredient)}
                    onChange={e => updateIngredient(index, e.target.value)}
                    placeholder="e.g. 500g Bread Flour"
                    className="mb-2"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addIngredient}
                className="text-xs flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Ingredient
              </Button>
            </div>
            
            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium mb-2">Instructions</label>
              {recipeForm.instructions.map((instruction, index) => (
                <div key={index} className="mb-2 flex items-center gap-2">
                  <span className="font-medium text-sm">{index + 1}.</span>
                  <Input
                    value={instruction}
                    onChange={e => updateInstruction(index, e.target.value)}
                    placeholder="Instruction step"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addInstruction}
                className="text-xs flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Step
              </Button>
            </div>
            
            {/* Calculate Button */}
            <Button
              onClick={handleCalculate}
              className="w-full"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                <><Calculator className="h-4 w-4 mr-2" /> Calculate & Analyze Recipe</>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* Results Panel */}
        <div className="space-y-6">
          {/* Baker's Percentages */}
          {conversionResult && (
            <Card>
              <CardHeader>
                <CardTitle>Baker's Percentages</CardTitle>
              </CardHeader>
              <CardContent>
                {conversionResult.bakersPercentages ? (
                  <>
                    <div className="flex justify-between mb-4 p-3 bg-muted rounded-md">
                      <span className="font-medium">Total Flour Weight:</span> 
                      <span>{conversionResult.bakersPercentages.totalFlourWeight}g</span>
                    </div>
                    
                    <div className="flex justify-between mb-4 p-3 bg-muted rounded-md">
                      <span className="font-medium">Hydration:</span> 
                      <span>{conversionResult.bakersPercentages.hydration}%</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Ingredient</th>
                            <th className="text-right py-2">Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conversionResult.bakersPercentages.percentages.map((item, idx) => (
                            <tr key={idx} className="border-b border-muted">
                              <td className="py-2">{item.name}</td>
                              <td className="text-right py-2">{item.percentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No flour found in recipe. Add flour to calculate percentages.</p>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* AI Assistant Recommendations */}
          {recentSuggestions.length > 0 && (
            <Card className="border-l-4 border-l-accent">
              <CardHeader>
                <CardTitle>AI Bread Assistant Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSuggestions.map((tip, idx) => (
                  <div key={idx} className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium">{tip.title}</h4>
                    <p className="text-sm mt-1">{tip.description}</p>
                  </div>
                ))}
                
                {lastAnalysisResult?.hydration && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <h4 className="font-medium">Calculated Hydration</h4>
                    <p className="text-sm mt-1">
                      Your recipe has approximately {lastAnalysisResult.hydration}% hydration.
                    </p>
                  </div>
                )}
                
                {lastAnalysisResult?.fermentationTime && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <h4 className="font-medium">Suggested Fermentation</h4>
                    <p className="text-sm mt-1">{lastAnalysisResult.fermentationTime}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BakersCalculator;
