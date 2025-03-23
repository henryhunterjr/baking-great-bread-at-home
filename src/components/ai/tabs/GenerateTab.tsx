import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Sparkles, 
  Download, 
  Heart,
  FileIcon,
  FileText
} from 'lucide-react';
import { recipeExamples } from '../utils/data';
import { generateRecipe } from '@/lib/ai-services/recipe-generator';
import { Recipe } from '@/types/recipe';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { downloadRecipePDF, downloadRecipeText } from '@/lib/pdf/pdf-generator';
import { useAuth } from '@/contexts/AuthContext';

interface GenerateTabProps {
  recipePrompt: string;
  setRecipePrompt: (prompt: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: (tab: string) => void;
}

const GenerateTab: React.FC<GenerateTabProps> = ({
  recipePrompt,
  setRecipePrompt,
  isProcessing,
  setIsProcessing,
  setMessages,
  setActiveTab
}) => {
  const { toast } = useToast();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const { isAuthenticated, saveUserRecipe, toggleRecipeFavorite, isRecipeFavorite } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleGenerateRecipeClick = async () => {
    if (!recipePrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Prompt",
        description: "Please describe the recipe you want to generate.",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const recipe = await generateRecipe(recipePrompt);
      
      setGeneratedRecipe(recipe);
      setRecipePrompt('');
      
      const assistantMessage = {
        role: 'assistant',
        content: `I've generated a recipe for "${recipe.title}" based on your request for "${recipePrompt}".`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Recipe Generated",
        description: "Your recipe has been generated successfully.",
      });
      
      setIsFavorite(false);
      
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: "Failed to generate recipe. Please try with a different prompt.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!generatedRecipe) return;
    
    try {
      await saveUserRecipe(generatedRecipe);
      toast({
        title: "Recipe Saved",
        description: "Recipe has been saved to your collection.",
      });
      setActiveTab('chat');
    } catch (error) {
      if (error instanceof Error && error.message === 'Not authenticated') {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to save recipes to your collection.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Save Error",
          description: "Failed to save recipe. Please try again.",
        });
      }
    }
  };
  
  const handleToggleFavorite = async () => {
    if (!generatedRecipe?.id) {
      toast({
        variant: "destructive",
        title: "Save Required",
        description: "Please save the recipe before adding it to favorites.",
      });
      return;
    }
    
    try {
      const newFavoriteState = await toggleRecipeFavorite(generatedRecipe.id);
      setIsFavorite(newFavoriteState);
      
      toast({
        title: newFavoriteState ? "Added to Favorites" : "Removed from Favorites",
        description: newFavoriteState 
          ? "Recipe has been added to your favorites." 
          : "Recipe has been removed from your favorites.",
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Not authenticated') {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to manage your favorites.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update favorites. Please try again.",
        });
      }
    }
  };
  
  const handleDownloadPDF = () => {
    if (!generatedRecipe) return;
    downloadRecipePDF(generatedRecipe);
  };
  
  const handleDownloadText = () => {
    if (!generatedRecipe) return;
    downloadRecipeText(generatedRecipe);
  };

  return (
    <div className="flex-1 p-4 flex flex-col h-full relative pb-20">
      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="recipe-prompt">Describe Your Ideal Recipe</Label>
          <Textarea
            id="recipe-prompt"
            placeholder="Describe the bread recipe you want me to create..."
            className="min-h-[150px] bg-white/90 dark:bg-slate-800/90 border-2 border-bread-700/40 focus:border-bread-700 focus:ring-2 focus:ring-bread-600/30 shadow-md placeholder:text-slate-500 dark:placeholder:text-slate-400"
            value={recipePrompt}
            onChange={(e) => setRecipePrompt(e.target.value)}
            disabled={isProcessing}
          />
        </div>
        
        <Alert className="bg-accent/20 border-accent">
          <AlertDescription className="text-xs">
            Be specific about ingredients, flavors, or techniques you'd like to include.
            I'll create a recipe inspired by Henry's baking philosophy that's tailored to your request!
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Recipe inspiration:</p>
          <div className="flex flex-wrap gap-2">
            {recipeExamples.map((example, index) => (
              <button
                key={index}
                className="text-xs bg-secondary/80 rounded-full px-3 py-1.5 hover:bg-bread-100 transition-colors"
                onClick={() => setRecipePrompt(example)}
                disabled={isProcessing}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
        
        {generatedRecipe && (
          <div className="bg-secondary/30 p-4 rounded-lg border border-bread-200 space-y-3">
            <h3 className="font-bold text-lg text-bread-800">{generatedRecipe.title}</h3>
            <p className="text-sm">{generatedRecipe.description}</p>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <Button 
                onClick={handleSaveRecipe}
                className="bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Save Recipe
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 shadow-sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleDownloadPDF}>
                      <FileIcon className="mr-2 h-4 w-4" />
                      <span>Download as PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadText}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Download as Text</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {generatedRecipe.id && (
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className={`${
                    isFavorite ? 'bg-pink-100 border-pink-300 text-pink-700' : 'bg-white'
                  }`}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`}
                  />
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t">
        <Button 
          onClick={handleGenerateRecipeClick}
          disabled={!recipePrompt.trim() || isProcessing}
          className="w-full bg-bread-800 hover:bg-bread-700 shadow-md"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Recipe...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Recipe
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GenerateTab;
