
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
      ingredients: [],
      instructions: [],
      imageUrl: recipe.imageUrl || '',
      isConverted: true
    };

    // Store recipe data in session storage for persistence
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
