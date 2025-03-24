
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AlertMessagesProps {
  error: string | null;
  showSuccess: boolean;
  showHelpTip: boolean;
  isConverting: boolean;
}

const AlertMessages: React.FC<AlertMessagesProps> = ({
  error,
  showSuccess,
  showHelpTip,
  isConverting
}) => {
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {showSuccess && (
        <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800">
          <AlertTitle className="text-green-800 dark:text-green-300">Text Extracted</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Text has been successfully extracted. You can now edit it before converting to a recipe.
          </AlertDescription>
        </Alert>
      )}
      
      {showHelpTip && !isConverting && !error && (
        <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800">
          <AlertTitle className="text-blue-800 dark:text-blue-300">Getting Started</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            Upload a recipe image or PDF, take a photo, or paste text from your clipboard using the options above.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertMessages;
