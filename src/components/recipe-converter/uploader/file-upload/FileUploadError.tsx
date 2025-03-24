
import React from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadErrorProps {
  error: string | null;
}

const FileUploadError: React.FC<FileUploadErrorProps> = ({ error }) => {
  if (!error) return null;
  
  // Format the error message to be more user-friendly
  let displayError = error;
  let helpText = '';
  let solution = '';
  
  // Check for PDF worker errors
  if (error.includes('pdf.worker.min.js') || error.includes('Failed to fetch')) {
    displayError = "Failed to load PDF processor. This might be due to network issues.";
    helpText = "If this problem persists, try using text input instead of PDF uploads.";
    solution = "Try refreshing the page or use a different file format.";
  }
  
  // Check for OCR errors
  else if (error.includes('OCR processing failed') || error.includes('OCR processing timed out')) {
    displayError = "Could not extract text from this image.";
    helpText = "Simple images with clear text work best. Make sure the text is not skewed or blurry.";
    solution = "Try with a clearer image or manually enter the recipe text.";
  }
  
  // Check for worker errors
  else if (error.includes('postMessage') || error.includes('could not be cloned')) {
    displayError = "Technical error processing your file.";
    helpText = "This is usually caused by a complex file format. Text input is the most reliable method.";
    solution = "Try a different file or copy and paste the text manually.";
  }
  
  // Check for clipboard errors
  else if (error.includes('clipboard')) {
    displayError = "Could not access your clipboard.";
    helpText = "This might be due to browser permissions or security settings.";
    solution = "Try manually typing or uploading your recipe text instead.";
  }
  
  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
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
        </div>
      </div>
    </div>
  );
};

export default FileUploadError;
