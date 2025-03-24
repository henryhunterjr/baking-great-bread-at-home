
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react';

interface ClipboardButtonProps {
  onPasteFromClipboard: () => Promise<void>;
  isDisabled: boolean;
  isProcessing: boolean;
}

const ClipboardButton: React.FC<ClipboardButtonProps> = ({
  onPasteFromClipboard,
  isDisabled,
  isProcessing
}) => {
  return (
    <Button 
      variant="outline" 
      className="flex flex-col items-center justify-center h-24 p-2"
      onClick={onPasteFromClipboard}
      disabled={isDisabled || isProcessing}
    >
      <Clipboard className="h-8 w-8 mb-2 text-bread-800" />
      <span className="text-xs text-center">Paste from Clipboard</span>
    </Button>
  );
};

export default ClipboardButton;
