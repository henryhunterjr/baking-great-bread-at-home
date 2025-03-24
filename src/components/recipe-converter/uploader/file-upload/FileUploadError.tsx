
import React from 'react';

interface FileUploadErrorProps {
  error: string | null;
}

const FileUploadError: React.FC<FileUploadErrorProps> = ({ error }) => {
  if (!error) return null;
  
  // Format the error message to be more user-friendly
  let displayError = error;
  
  // Check for PDF worker errors
  if (error.includes('pdf.worker.min.js') || error.includes('Failed to fetch')) {
    displayError = "Failed to load PDF processor. This might be due to network issues. Please try again or use a different file format.";
  }
  
  // Check for OCR errors
  if (error.includes('OCR processing failed')) {
    displayError = "Could not extract text from this image. Please try with a clearer image or manually enter the recipe text.";
  }
  
  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
      {displayError}
      {error.includes('worker') && (
        <div className="mt-2 text-xs">
          Tip: Text and image files are usually more reliable than PDFs. Try copying and pasting the recipe text directly.
        </div>
      )}
    </div>
  );
};

export default FileUploadError;
