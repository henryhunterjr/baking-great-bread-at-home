
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface AlertMessagesProps {
  showSuccess?: boolean;
  error?: string | null;
  showHelpTip?: boolean;
  isConverting?: boolean;
}

const AlertMessages: React.FC<AlertMessagesProps> = ({ 
  showSuccess, 
  error, 
  showHelpTip,
  isConverting 
}) => {
  return (
    <>
      {/* Success message */}
      {showSuccess && !error && (
        <Alert className="bg-green-50 border border-green-100">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Text Ready</AlertTitle>
          <AlertDescription className="text-green-700">
            We've detected recipe text. Press "Convert Recipe" to continue.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Help tip */}
      {showHelpTip && !error && !isConverting && (
        <Alert className="bg-blue-50 border-blue-100">
          <HelpCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Tip</AlertTitle>
          <AlertDescription className="text-blue-700">
            Paste your recipe text above or use one of the upload options below.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Processing indicator */}
      {isConverting && (
        <Alert className="bg-amber-50 border-amber-100">
          <div className="animate-spin h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full" />
          <AlertTitle className="text-amber-800">Processing Recipe</AlertTitle>
          <AlertDescription className="text-amber-700">
            Please wait while we convert your recipe...
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertMessages;
