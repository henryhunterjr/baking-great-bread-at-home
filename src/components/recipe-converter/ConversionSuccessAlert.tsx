
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookmarkPlus } from 'lucide-react';

interface ConversionSuccessAlertProps {
  show?: boolean;
}

const ConversionSuccessAlert: React.FC<ConversionSuccessAlertProps> = ({ show = true }) => {
  if (!show) return null;
  
  return (
    <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800">
      <BookmarkPlus className="h-4 w-4 text-green-700 dark:text-green-400" />
      <AlertDescription className="text-green-700 dark:text-green-400 flex items-center gap-2">
        <span>Your recipe has been successfully converted. Click "Save Recipe" to add it to your collection.</span>
      </AlertDescription>
    </Alert>
  );
};

export default ConversionSuccessAlert;
