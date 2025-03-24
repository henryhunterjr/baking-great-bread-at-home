
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronRight } from 'lucide-react';

interface ConvertButtonProps {
  isConverting: boolean;
  isDisabled: boolean;
}

const ConvertButton: React.FC<ConvertButtonProps> = ({ isConverting, isDisabled }) => {
  return (
    <div className="flex justify-end mt-4">
      <Button 
        type="submit" 
        disabled={isConverting || isDisabled} 
        className="bg-bread-800 hover:bg-bread-900 text-white"
      >
        {isConverting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Converting...
          </>
        ) : (
          <>
            Convert Recipe
            <ChevronRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ConvertButton;
