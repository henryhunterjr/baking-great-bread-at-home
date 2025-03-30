
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, AlertCircle } from 'lucide-react';

interface FormActionsProps {
  onCancel: () => void;
  isDirty: boolean;
  isValid?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isDirty,
  isValid = true 
}) => {
  const isSaveEnabled = isDirty && isValid;
  
  return (
    <div className="flex justify-end space-x-2 pt-4 relative">
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
        disabled={!isSaveEnabled}
      >
        <Save className="mr-2 h-4 w-4" />
        Save Recipe
      </Button>
      {!isValid && isDirty && (
        <div className="text-destructive text-sm absolute -top-6 right-0 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          Please fill in all required fields
        </div>
      )}
    </div>
  );
};

export default FormActions;
