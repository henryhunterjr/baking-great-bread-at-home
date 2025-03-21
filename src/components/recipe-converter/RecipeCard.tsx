
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RecipeData } from '@/pages/RecipeConverter';
import { 
  Clock, 
  Edit, 
  Printer, 
  Share2,
  Heart,
  RotateCcw,
  ChefHat 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface RecipeCardProps {
  recipe: RecipeData;
  onEdit: () => void;
  onPrint: () => void;
  onReset: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onEdit, 
  onPrint,
  onReset
}) => {
  const { toast } = useToast();
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe for ${recipe.title}!`,
          url: window.location.href,
        });
      } else {
        // Fallback if Web Share API is not available
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Recipe link copied to clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing recipe:", error);
    }
  };
  
  const handleFavorite = () => {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    
    // Check if recipe is already saved
    const isAlreadySaved = savedRecipes.some((savedRecipe: RecipeData) => 
      savedRecipe.title === recipe.title
    );
    
    if (!isAlreadySaved) {
      savedRecipes.push(recipe);
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
      
      toast({
        title: "Recipe Saved!",
        description: "Recipe added to your favorites.",
      });
    } else {
      toast({
        title: "Already Saved",
        description: "This recipe is already in your favorites.",
      });
    }
  };
  
  return (
    <Card className="shadow-md overflow-hidden print:shadow-none" id="recipe-card">
      <div 
        className="h-48 md:h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${recipe.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 right-4 flex gap-2 print:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/90 hover:bg-white"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/90 hover:bg-white"
            onClick={onPrint}
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/90 hover:bg-white"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/90 hover:bg-white"
            onClick={handleFavorite}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-medium mb-3">{recipe.title}</h1>
          {recipe.introduction && (
            <p className="text-muted-foreground italic mb-4">{recipe.introduction}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm">
            {recipe.prepTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-bread-800" />
                <span>Prep: {recipe.prepTime}</span>
              </div>
            )}
            {recipe.restTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-bread-800" />
                <span>Rest: {recipe.restTime}</span>
              </div>
            )}
            {recipe.bakeTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-bread-800" />
                <span>Bake: {recipe.bakeTime}</span>
              </div>
            )}
            {recipe.totalTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-bread-800" />
                <span>Total: {recipe.totalTime}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-xl font-serif font-medium mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-baseline gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-bread-800 mt-1.5"></div>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
            
            {recipe.equipmentNeeded.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-serif font-medium mb-3">Equipment Needed</h3>
                <ul className="space-y-2">
                  {recipe.equipmentNeeded.map((equipment, index) => (
                    <li key={index} className="flex items-baseline gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-bread-800 mt-1.5"></div>
                      <span>
                        {equipment.affiliateLink ? (
                          <a 
                            href={equipment.affiliateLink}
                            className="text-bread-800 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {equipment.name}
                          </a>
                        ) : (
                          equipment.name
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-xl font-serif font-medium mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <div className="bg-bread-800 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p>{instruction}</p>
                </li>
              ))}
            </ol>
            
            {(recipe.tips.length > 0 || recipe.proTips.length > 0) && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recipe.tips.length > 0 && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-serif font-medium flex items-center">
                      <ChefHat className="h-4 w-4 mr-2 text-bread-800" />
                      Tips
                    </h3>
                    <ul className="space-y-2">
                      {recipe.tips.map((tip, index) => (
                        <li key={index} className="text-sm">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {recipe.proTips.length > 0 && (
                  <div className="space-y-3 p-4 bg-accent/20 rounded-lg">
                    <h3 className="font-serif font-medium flex items-center">
                      <ChefHat className="h-4 w-4 mr-2 text-bread-800" />
                      Pro Tips
                    </h3>
                    <ul className="space-y-2">
                      {recipe.proTips.map((proTip, index) => (
                        <li key={index} className="text-sm">{proTip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {recipe.tags.length > 0 && (
          <div className="mt-8">
            <Separator className="mb-4" />
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-between items-center print:hidden">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onReset}
            className="text-muted-foreground"
          >
            <RotateCcw className="h-3 w-3 mr-2" />
            New Conversion
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="h-3 w-3 mr-2" />
              Edit
            </Button>
            <Button
              size="sm"
              className="bg-bread-800 hover:bg-bread-900"
              onClick={onPrint}
            >
              <Printer className="h-3 w-3 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
