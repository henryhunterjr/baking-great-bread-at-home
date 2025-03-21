
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface FormActionsProps {
  onCancel: () => void;
  isDirty: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, isDirty }) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-bread-800 hover:bg-bread-900"
        disabled={!isDirty}
      >
        <Save className="mr-2 h-4 w-4" />
        Save Recipe
      </Button>
    </div>
  );
};

export default FormActions;
