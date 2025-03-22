
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react';
import ConvertButton from '../ConvertButton';

interface ClipboardTabProps {
  recipeText: string;
  handlePaste: () => void;
  isConverting: boolean;
  onConvertRecipe: () => void;
}

const ClipboardTab: React.FC<ClipboardTabProps> = ({ 
  recipeText, 
  handlePaste, 
  isConverting,
  onConvertRecipe
}) => {
  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <Clipboard className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Paste From Clipboard</h3>
        <p className="text-muted-foreground mb-4">
          Paste recipe text from your clipboard
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={handlePaste}
        >
          Paste From Clipboard
        </Button>
      </div>
      
      {recipeText && (
        <div className="mt-4">
          <ConvertButton 
            onClick={onConvertRecipe}
            isConverting={isConverting}
            fullWidth={true}
          />
        </div>
      )}
    </div>
  );
};

export default ClipboardTab;
