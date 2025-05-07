
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecipeSuccessProps {
  onContinue: () => void;
}

const RecipeSuccess: React.FC<RecipeSuccessProps> = ({ onContinue }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-green-100 p-3 mb-4">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Recipe Successfully Converted!</h2>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        Your recipe has been successfully converted into a structured format. 
        You can now edit it, save it to your collection, or share it with others.
      </p>
      
      <Button onClick={onContinue} size="lg">
        Continue to Edit Recipe
      </Button>
    </div>
  );
};

export default RecipeSuccess;
