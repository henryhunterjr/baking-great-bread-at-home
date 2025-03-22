
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ConvertButtonProps {
  onClick: () => void;
  isConverting: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const ConvertButton: React.FC<ConvertButtonProps> = ({ onClick, isConverting, disabled = false, fullWidth = false }) => {
  return (
    <Button 
      type="button" 
      className={`bg-bread-800 text-white hover:bg-bread-900 ${fullWidth ? 'w-full' : ''}`}
      disabled={isConverting || disabled}
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
