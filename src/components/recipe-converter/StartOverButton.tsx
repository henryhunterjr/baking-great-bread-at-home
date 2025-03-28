
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface StartOverButtonProps {
  onClick: () => void;
  className?: string;
}

const StartOverButton: React.FC<StartOverButtonProps> = ({ onClick, className = '' }) => {
  return (
    <Button 
      variant="outline" 
      onClick={onClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <RotateCcw className="h-4 w-4" />
      Start Over
    </Button>
  );
};

export default StartOverButton;
