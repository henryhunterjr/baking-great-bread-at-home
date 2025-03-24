
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface ClearTextButtonProps {
  onClearText: () => void;
  isDisabled: boolean;
  isProcessing: boolean;
}

const ClearTextButton: React.FC<ClearTextButtonProps> = ({
  onClearText,
  isDisabled,
  isProcessing
}) => {
  return (
    <Button 
      variant="outline" 
      className="flex flex-col items-center justify-center h-24 p-2"
      onClick={onClearText}
      disabled={isDisabled || isProcessing}
    >
      <FileText className="h-8 w-8 mb-2 text-bread-800" />
      <span className="text-xs text-center">Clear Text</span>
    </Button>
  );
};

export default ClearTextButton;
