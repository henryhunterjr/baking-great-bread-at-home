
import React from 'react';
import { AlertCircle, HelpCircle, ExternalLink } from 'lucide-react';
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
  let learnMoreLink = '';
  
  // Check for PDF worker errors
  if (error.includes('pdf.worker.min.js') || error.includes('Failed to fetch') || error.includes('network')) {
    displayError = "Failed to load PDF processor. This might be due to network issues.";
    helpText = "If this problem persists, try using text input instead of PDF uploads.";
    solution = "Try refreshing the page or check your internet connection.";
    learnMoreLink = "https://mozilla.github.io/pdf.js/getting_started/";
  }
  
  // Check for OCR errors
  else if (error.includes('OCR processing failed') || error.includes('OCR processing timed out') || error.includes('recognize')) {
    displayError = "Could not extract text from this image.";
    helpText = "Simple images with clear text work best. Make sure the text is not skewed or blurry.";
    solution = "Try with a clearer image or manually enter the recipe text.";
    learnMoreLink = "https://tesseract.projectnaptha.com/";
  }
  
  // Check for worker errors
  else if (error.includes('postMessage') || error.includes('could not be cloned') || error.includes('worker')) {
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
  
  // Check for file size errors
  else if (error.includes('size') || error.includes('large')) {
    displayError = "File is too large to process.";
    helpText = "Files over 10MB may cause issues with browser processing.";
    solution = "Try breaking the file into smaller parts or extract just the recipe text.";
  }
  
  // Check for timeout errors
  else if (error.includes('timeout') || error.includes('timed out')) {
    displayError = "Operation timed out.";
    helpText = "This could be due to a complex file or slower device.";
    solution = "Try with a simpler file format or use the text input option.";
  }
  
  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
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
              className="text-xs flex items-center gap-1 mt-2 text-red-700 hover:text-red-800"
            >
              <ExternalLink className="h-3 w-3" />
              Learn more about this issue
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadError;
