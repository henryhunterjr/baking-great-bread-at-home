
import React from 'react';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/types/recipe';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Download, Heart, FileIcon, FileText } from 'lucide-react';

interface GeneratedRecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  handleSaveRecipe: () => void;
  handleToggleFavorite: () => void;
  handleDownloadPDF: () => void;
  handleDownloadText: () => void;
}

const GeneratedRecipeCard: React.FC<GeneratedRecipeCardProps> = ({
  recipe,
  isFavorite,
  handleSaveRecipe,
  handleToggleFavorite,
  handleDownloadPDF,
  handleDownloadText
}) => {
  return (
    <div className="bg-secondary/30 p-4 rounded-lg border border-bread-200 space-y-3">
      <h3 className="font-bold text-lg text-bread-800">{recipe.title}</h3>
      <p className="text-sm">{recipe.description}</p>
      
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
        
        {recipe.id && (
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
  );
};

export default GeneratedRecipeCard;
