
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Download } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { FileIcon, FileText as FileTextIcon } from 'lucide-react';
import { Recipe } from '@/types/recipe';

interface ConvertActionsProps {
  recipeText: string;
  convertedRecipe: Recipe | null;
  isProcessing: boolean;
  handleConvertRecipe: () => void;
  handleSaveRecipe: () => void;
  handleDownloadPDF: () => void;
  handleDownloadText: () => void;
}

const ConvertActions: React.FC<ConvertActionsProps> = ({
  recipeText,
  convertedRecipe,
  isProcessing,
  handleConvertRecipe,
  handleSaveRecipe,
  handleDownloadPDF,
  handleDownloadText
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Button 
        onClick={handleConvertRecipe}
        disabled={!recipeText.trim() || isProcessing}
        className="w-full bg-bread-800 hover:bg-bread-700 shadow-md"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Converting Recipe...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Convert Recipe
          </>
        )}
      </Button>
      
      {convertedRecipe && (
        <>
          <Button 
            onClick={handleSaveRecipe}
            className="w-full bg-blue-600 hover:bg-blue-700 shadow-md"
            disabled={isProcessing}
          >
            Save Recipe
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 shadow-md"
                disabled={isProcessing}
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
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  <span>Download as Text</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

export default ConvertActions;
