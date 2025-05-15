
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HelpCircle } from 'lucide-react';

const RecipeHelp: React.FC = () => {
  return (
    <Alert className="mb-4 bg-muted/50 border-muted">
      <HelpCircle className="h-4 w-4 text-muted-foreground" />
      <AlertTitle className="text-sm font-medium">Recipe Format Tips</AlertTitle>
      <AlertDescription className="text-xs mt-1">
        <ul className="list-disc pl-4 space-y-1">
          <li>Include a clear recipe title at the beginning</li>
          <li>Separate ingredients and instructions into clear sections</li>
          <li>For ingredients, include quantity, unit, and name (e.g., "2 cups flour")</li>
          <li>Number your instructions or separate them with line breaks</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default RecipeHelp;
