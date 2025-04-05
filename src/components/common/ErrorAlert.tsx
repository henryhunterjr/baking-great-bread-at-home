
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, HelpCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  error?: string | null;
  message?: string | null;
  className?: string;
  title?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  solution?: string;
  learnMoreLink?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  message, 
  className = '', 
  title = 'Error',
  showRetry = false,
  onRetry,
  solution,
  learnMoreLink
}) => {
  // Use message if provided, otherwise use error
  const displayMessage = message || error;
  
  if (!displayMessage) return null;

  // Determine if this is a worker-related error
  const isWorkerError = displayMessage.includes('worker') || 
                        displayMessage.includes('importScripts') ||
                        displayMessage.includes('tesseract') ||
                        displayMessage.includes('PDF');

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <div className="w-full">
        {title && <AlertTitle className="font-medium">{title}</AlertTitle>}
        <AlertDescription className="mt-1">{displayMessage}</AlertDescription>
        
        {(solution || isWorkerError) && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            <HelpCircle className="h-3 w-3" />
            <span className="font-medium">Suggestion:</span> 
            {solution || (isWorkerError ? 
              "Please refresh the page or try with a different file format." : 
              "Please try again or contact support if the issue persists.")}
          </div>
        )}
        
        {(learnMoreLink || isWorkerError) && (
          <a 
            href={learnMoreLink || "https://docs.lovable.dev/troubleshooting#file-processing-issues"}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 mt-2 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            <ExternalLink className="h-3 w-3" />
            Learn more about this issue
          </a>
        )}
        
        {(showRetry || onRetry) && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry} 
            className="mt-3 h-8 text-xs border-red-600 text-red-600 hover:bg-red-100"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Try Again
          </Button>
        )}
      </div>
    </Alert>
  );
};

export default ErrorAlert;
