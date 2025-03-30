
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface AlertMessagesProps {
  showSuccess: boolean;
  error?: string | null;
}

const AlertMessages: React.FC<AlertMessagesProps> = ({ showSuccess, error }) => {
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
  
  return null;
};

export default AlertMessages;
