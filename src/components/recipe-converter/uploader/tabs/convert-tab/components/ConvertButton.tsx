
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ConvertButtonProps {
  isConverting: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const ConvertButton: React.FC<ConvertButtonProps> = ({ 
  isConverting, 
  isDisabled = false,
  onClick
}) => {
  return (
    <Button 
      type="submit" 
      className="bg-bread-800 text-white hover:bg-bread-900 w-full"
      disabled={isConverting || isDisabled}
      onClick={onClick}
    >
      {isConverting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Converting...
        </>
      ) : (
        'Convert Recipe'
      )}
    </Button>
  );
};

export default ConvertButton;
