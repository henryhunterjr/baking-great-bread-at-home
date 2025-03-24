
import React from 'react';

interface FileUploadErrorProps {
  error: string | null;
}

const FileUploadError: React.FC<FileUploadErrorProps> = ({ error }) => {
  if (!error) return null;
  
  // Format the error message to be more user-friendly
  let displayError = error;
  let helpText = '';
  
  // Check for PDF worker errors
  if (error.includes('pdf.worker.min.js') || error.includes('Failed to fetch')) {
    displayError = "Failed to load PDF processor. This might be due to network issues. Please try again or use a different file format.";
    helpText = "If this problem persists, try using text input instead of PDF uploads.";
  }
  
  // Check for OCR errors
  else if (error.includes('OCR processing failed') || error.includes('OCR processing timed out')) {
    displayError = "Could not extract text from this image. Please try with a clearer image or manually enter the recipe text.";
    helpText = "Simple images with clear text work best. Make sure the text is not skewed or blurry.";
  }
  
  // Check for worker errors
  else if (error.includes('postMessage') || error.includes('could not be cloned')) {
    displayError = "Technical error processing your file. Please try a different file or copy and paste the text manually.";
    helpText = "This is usually caused by a complex file format. Text input is the most reliable method.";
  }
  
  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
      <div className="font-medium mb-1">{displayError}</div>
      {helpText && <div className="text-xs">{helpText}</div>}
    </div>
  );
};

export default FileUploadError;
