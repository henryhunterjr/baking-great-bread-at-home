
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

interface AlertMessagesProps {
  showSuccess: boolean;
  error?: string | null;
  showHelpTip?: boolean;
  isConverting?: boolean;
}

const AlertMessages: React.FC<AlertMessagesProps> = ({ showSuccess, error, showHelpTip, isConverting }) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4 animate-in fade-in-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (showSuccess) {
    return (
      <Alert className="mb-4 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 animate-in fade-in-50">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription>
          Text extracted successfully! You can now convert your recipe.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (showHelpTip && !isConverting) {
    return (
      <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 animate-in fade-in-50">
        <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription>
          Type or paste your recipe text above, or use one of the upload options.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default AlertMessages;
