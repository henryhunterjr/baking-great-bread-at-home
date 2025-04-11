
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logInfo } from '@/utils/logger';

interface FormActionsProps {
  onCancel: () => void;
  isDirty: boolean;
  isValid?: boolean;
  onSubmit?: () => void;
  isProcessing?: boolean;
  processingMessage?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isDirty,
  isValid = true,
  onSubmit,
  isProcessing = false,
  processingMessage = "Saving..."
}) => {
  const { toast } = useToast();
  const isSaveEnabled = isDirty && isValid && !isProcessing;
  
  const handleSave = () => {
    if (!isSaveEnabled) {
      if (isProcessing) {
        toast({
          variant: "default",
          title: "Processing in Progress",
          description: "Please wait while the current operation completes.",
        });
        return;
      }
      
      toast({
        variant: "destructive",
        title: "Cannot Save",
        description: "Please check that all required fields are filled in correctly.",
      });
      return;
    }
    
    logInfo("FormActions: Save button clicked", { isDirty, isValid });
    
    if (onSubmit) {
      onSubmit();
    }
  };
  
  return (
    <div className="flex justify-end space-x-2 pt-4 relative">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isProcessing}
      >
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      <Button 
        type="button"
        className="bg-bread-800 hover:bg-bread-900 text-white"
        disabled={!isSaveEnabled}
        onClick={handleSave}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {processingMessage}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Recipe
          </>
        )}
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
