
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Lightbulb, AlertTriangle } from 'lucide-react';

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
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {showSuccess && (
        <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">Text Extracted</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Text has been successfully extracted. You can now edit it before converting to a recipe. Review it to ensure all necessary details are captured correctly.
          </AlertDescription>
        </Alert>
      )}
      
      {showHelpTip && !isConverting && !error && (
        <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800">
          <Lightbulb className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-800 dark:text-blue-300">Getting Started</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            Upload a recipe image or PDF, take a photo, or paste text from your clipboard using the options above. For best results, choose clear images with good lighting and well-formatted text.
          </AlertDescription>
        </Alert>
      )}
      
      {isConverting && (
        <Alert className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">Processing Your Recipe</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            Please wait while we convert your recipe. This process may take a moment depending on the recipe complexity.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertMessages;
