
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '../utils/types';
import { useNavigate } from 'react-router-dom';
import { RecipeData } from '@/types/recipeTypes';
import { useToast } from '@/hooks/use-toast';

interface MessageCardProps {
  message: ChatMessage;
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewRecipe = (e: React.MouseEvent, recipe: any) => {
    e.preventDefault();
    
    // Convert the attached recipe to the proper RecipeData format
    const recipeData: RecipeData = {
      title: recipe.title || 'Untitled Recipe',
      introduction: recipe.description || '',
      ingredients: recipe.fullRecipe?.ingredients || [
        '2-3 ripe bananas, mashed',
        '1/3 cup melted butter',
        '1 teaspoon baking soda',
        'Pinch of salt',
        '3/4 cup sugar',
        '1 large egg, beaten',
        '1 teaspoon vanilla extract',
        '1 1/2 cups all-purpose flour'
      ],
      instructions: recipe.fullRecipe?.instructions || [
        'Preheat the oven to 350°F (175°C) and butter a 4x8-inch loaf pan.',
        'In a mixing bowl, mash the ripe bananas with a fork until smooth.',
        'Stir the melted butter into the mashed bananas.',
        'Mix in the baking soda and salt.',
        'Stir in the sugar, beaten egg, and vanilla extract.',
        'Mix in the flour.',
        'Pour the batter into the prepared loaf pan and bake for 50-60 minutes.',
        'Remove from oven and let cool in the pan for a few minutes. Then remove from the pan and let cool completely before slicing.'
      ],
      imageUrl: recipe.imageUrl || '',
      isConverted: true
    };

    console.log("Recipe being sent to converter:", recipeData);

    // Store recipe data in session storage for persistence across page refreshes
    sessionStorage.setItem('viewedRecipe', JSON.stringify(recipeData));
    
    // Navigate to recipe converter with the recipe data
    navigate('/recipe-converter', { state: { recipe: recipeData } });
    
    toast({
      title: "Recipe Loaded",
      description: `${recipe.title} has been loaded into the recipe converter.`
    });
  };

  return (
    <Card className={`mb-4 ${message.role === 'user' ? 'bg-primary/10 ml-12' : 'bg-muted/50 mr-12'}`}>
      <CardContent className="p-4">
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {message.attachedRecipe && (
          <div className="mt-3 p-3 bg-card rounded-md border">
            <h3 className="text-lg font-semibold">{message.attachedRecipe.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{message.attachedRecipe.description}</p>
            
            {message.attachedRecipe.imageUrl && (
              <div className="w-full mb-2 rounded overflow-hidden">
                <img 
                  src={message.attachedRecipe.imageUrl} 
                  alt={message.attachedRecipe.title}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="mt-2 w-full flex items-center justify-center"
              onClick={(e) => handleViewRecipe(e, message.attachedRecipe)}
            >
              View Recipe
            </Button>
          </div>
        )}
        
        {message.timestamp && (
          <div className="mt-2 text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageCard;
