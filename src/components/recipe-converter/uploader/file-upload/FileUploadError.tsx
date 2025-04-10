
import React from 'react';
import { AlertCircle, HelpCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadErrorProps {
  error: string | null;
  onRetry?: () => void;
}

const FileUploadError: React.FC<FileUploadErrorProps> = ({ error, onRetry }) => {
  if (!error) return null;
  
  // Format the error message to be more user-friendly
  let displayError = error;
  let helpText = '';
  let solution = '';
  let learnMoreLink = '';
  
  // Check for worker script loading errors (which appear to be the main issue)
  if (error.includes('importScripts') || error.includes('worker.min.js') || error.includes('tesseract/worker.min.js')) {
    displayError = "Couldn't load text recognition tools for processing your file.";
    helpText = "This is usually due to missing worker files or network issues.";
    solution = "Try refreshing the page or uploading a simpler file format like a plain text file.";
  }
  // Check for PDF worker errors
  else if (error.includes('pdf.worker.min.js') || error.includes('Failed to fetch') || error.includes('network')) {
    displayError = "Failed to load PDF processor. This might be due to network issues.";
    helpText = "If this problem persists, try using text input instead of PDF uploads.";
    solution = "Try refreshing the page or check your internet connection.";
    learnMoreLink = "https://mozilla.github.io/pdf.js/getting_started/";
  }
  // Check for timeout errors
  else if (error.includes('timeout') || error.includes('timed out')) {
    displayError = "Operation timed out.";
    helpText = "This could be due to a complex PDF, large file size, or slower device.";
    solution = "Try with a simpler PDF, extract just the recipe text, or use the text input option.";
  }
  // Check for OCR errors
  else if (error.includes('OCR processing failed') || error.includes('OCR processing timed out') || error.includes('recognize')) {
    displayError = "Could not extract text from this image.";
    helpText = "Simple images with clear text work best. Make sure the text is not skewed or blurry.";
    solution = "Try with a clearer image or manually enter the recipe text.";
  }
  // Check for worker errors
  else if (error.includes('postMessage') || error.includes('could not be cloned') || error.includes('worker')) {
    displayError = "Technical error processing your file.";
    helpText = "This is usually caused by a complex file format. Text input is the most reliable method.";
    solution = "Try a different file or copy and paste the text manually.";
  }
  
  return (
    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-300 text-sm">
      <div className="flex gap-2">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <div>
          <div className="font-medium mb-1">{displayError}</div>
          {helpText && <div className="text-xs mb-2">{helpText}</div>}
          {solution && (
            <div className="text-xs flex items-center gap-1 mt-1">
              <HelpCircle className="h-3 w-3" />
              <span className="font-medium">Suggestion:</span> {solution}
            </div>
          )}
          {learnMoreLink && (
            <a 
              href={learnMoreLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 mt-2 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              <ExternalLink className="h-3 w-3" />
              Learn more about this issue
            </a>
          )}
          {onRetry && (
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
      </div>
    </div>
  );
};

export default FileUploadError;
