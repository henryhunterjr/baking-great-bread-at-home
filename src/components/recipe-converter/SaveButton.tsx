
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, isDisabled = false }) => {
  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      variant="default"
      className="bg-green-600 hover:bg-green-700 text-white gap-2"
    >
      <Save className="h-4 w-4" />
      Save Recipe
    </Button>
  );
};

export default SaveButton;
