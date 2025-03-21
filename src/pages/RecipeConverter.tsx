
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import RecipeUploader from '@/components/recipe-converter/RecipeUploader';
import RecipeForm from '@/components/recipe-converter/RecipeForm';
import RecipeCard from '@/components/recipe-converter/RecipeCard';
import RecipeAssistant from '@/components/recipe-converter/RecipeAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export type RecipeData = {
  title: string;
  introduction: string;
  ingredients: string[];
  prepTime: string;
  restTime: string;
  bakeTime: string;
  totalTime: string;
  instructions: string[];
  tips: string[];
  proTips: string[];
  equipmentNeeded: { name: string; affiliateLink?: string }[];
  imageUrl: string;
  tags: string[];
  isPublic: boolean;
  isConverted: boolean;
};

const defaultRecipe: RecipeData = {
  title: '',
  introduction: '',
  ingredients: [],
  prepTime: '',
  restTime: '',
  bakeTime: '',
  totalTime: '',
  instructions: [],
  tips: [],
  proTips: [],
  equipmentNeeded: [],
  imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
  tags: [],
  isPublic: false,
  isConverted: false
};

const RecipeConverter: React.FC = () => {
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<RecipeData>(defaultRecipe);
  const [isConverting, setIsConverting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleConversion = async (text: string) => {
    setIsConverting(true);
    
    try {
      // Simulate AI processing (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock recipe data (replace with actual conversion logic)
      const convertedRecipe: RecipeData = {
        title: 'Classic Sourdough Bread',
        introduction: 'This treasured recipe was passed down from my grandmother. The coffee stains on the original card remind me of Sunday mornings in her kitchen.',
        ingredients: [
          '500g (4 cups) bread flour',
          '350g (1 1/2 cups) water',
          '100g (1/2 cup) active sourdough starter',
          '10g (2 tsp) salt'
        ],
        prepTime: '30 minutes',
        restTime: '12-14 hours',
        bakeTime: '45 minutes',
        totalTime: '13-15 hours',
        instructions: [
          'Mix flour and water until no dry spots remain. Cover and rest for 30 minutes.',
          'Add starter and salt, then perform stretch and folds until dough becomes elastic.',
          'Cover and let rise at room temperature for 3-4 hours, performing stretch and folds every 30 minutes for the first 2 hours.',
          'Shape the dough into a boule or batard and place in a floured banneton.',
          'Refrigerate overnight (8-10 hours) for slow fermentation.',
          'Preheat oven to 500°F (260°C) with Dutch oven inside for 1 hour.',
          'Score dough and bake covered for 20 minutes, then uncovered for 20-25 minutes until deep golden brown.',
          'Cool completely on a wire rack before slicing.'
        ],
        tips: [
          'The dough should increase in volume by about 30-50% during bulk fermentation.',
          'If you don\'t have a Dutch oven, use a baking stone with a metal bowl as a cover.',
          'The bread is done when it sounds hollow when tapped on the bottom.'
        ],
        proTips: [
          'For a more open crumb, increase hydration to 75-80% once you\'re comfortable with the process.',
          'Try cold autolyse by mixing flour and water and refrigerating overnight before adding starter.',
          'Use rice flour for dusting your banneton to prevent sticking.'
        ],
        equipmentNeeded: [
          { name: 'Dutch Oven', affiliateLink: '/tools/dutch-oven' },
          { name: 'Banneton Basket', affiliateLink: '/tools/banneton' },
          { name: 'Bread Lame', affiliateLink: '/tools/bread-lame' },
          { name: 'Kitchen Scale', affiliateLink: '/tools/kitchen-scale' }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop',
        tags: ['sourdough', 'bread', 'artisan', 'traditional'],
        isPublic: false,
        isConverted: true
      };
      
      setRecipe(convertedRecipe);
      setIsEditing(true);
      
      toast({
        title: "Recipe Converted!",
        description: "Your recipe has been successfully converted. You can now edit, save, or print it.",
      });
    } catch (error) {
      console.error("Error converting recipe:", error);
      toast({
        variant: "destructive",
        title: "Conversion Failed",
        description: "We couldn't convert your recipe. Please try again or use a different format.",
      });
    } finally {
      setIsConverting(false);
    }
  };
  
  const handleSaveRecipe = (updatedRecipe: RecipeData) => {
    setRecipe(updatedRecipe);
    setIsEditing(false);
    
    // Here you would save to backend/localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    savedRecipes.push(updatedRecipe);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    
    toast({
      title: "Recipe Saved!",
      description: "Your recipe has been saved to your collection.",
    });
  };
  
  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <h1 className="section-title text-center mb-3">From Card to Kitchen</h1>
      <p className="section-subtitle text-center mb-8">
        Convert old family recipes, scanned images, or digital clippings into clean, standardized recipe cards
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {!recipe.isConverted ? (
            <RecipeUploader 
              onConvertRecipe={handleConversion} 
              isConverting={isConverting} 
            />
          ) : isEditing ? (
            <RecipeForm 
              initialRecipe={recipe} 
              onSave={handleSaveRecipe} 
              onCancel={() => setIsEditing(false)} 
            />
          ) : (
            <div className="space-y-4">
              <RecipeCard 
                recipe={recipe} 
                onEdit={() => setIsEditing(true)} 
                onPrint={() => window.print()} 
                onReset={() => {
                  setRecipe(defaultRecipe);
                  setIsEditing(false);
                }}
              />
            </div>
          )}
        </div>
        
        <div>
          <Tabs defaultValue="assistant" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
              <TabsTrigger value="favorites">My Recipes</TabsTrigger>
            </TabsList>
            <TabsContent value="assistant" className="mt-4">
              <RecipeAssistant recipe={recipe} />
            </TabsContent>
            <TabsContent value="favorites" className="mt-4">
              <div className="space-y-4 bg-secondary/50 rounded-lg p-4">
                <h3 className="font-serif text-xl font-medium">Saved Recipes</h3>
                <Separator />
                <div className="space-y-2">
                  {JSON.parse(localStorage.getItem('savedRecipes') || '[]').length > 0 ? (
                    JSON.parse(localStorage.getItem('savedRecipes') || '[]').map((savedRecipe: RecipeData, index: number) => (
                      <div 
                        key={index}
                        className="p-3 bg-card rounded-md cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => {
                          setRecipe(savedRecipe);
                          setIsEditing(false);
                        }}
                      >
                        <h4 className="font-medium">{savedRecipe.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {savedRecipe.tags.slice(0, 3).join(', ')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No saved recipes yet. Convert and save recipes to see them here.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RecipeConverter;
