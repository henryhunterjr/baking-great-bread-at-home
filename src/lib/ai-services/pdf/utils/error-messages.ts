
/**
 * Generate user-friendly error messages based on error types
 */
export const getPDFErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'An unknown error occurred while processing the PDF.';
  }
  
  const { message } = error;
  
  if (message.includes('timed out') || message.includes('timeout')) {
    return 'PDF processing timed out. Please use a smaller or simpler PDF, or paste the recipe text directly.';
  }
  
  if (message.includes('password')) {
    return 'This PDF appears to be password protected. Please provide an unprotected PDF.';
  }
  
  if (message.includes('worker') || message.includes('network')) {
    return 'PDF processing failed due to network issues. Please check your connection and try again.';
  }
  
  if (message.includes('file size') || message.includes('too large')) {
    return `This PDF file is too large. Please use a file smaller than 8MB or extract just the text you need.`;
  }
  
  // Return the original message if we don't have a specific friendly message
  return `PDF processing error: ${message}`;
};

/**
 * Get OCR-specific error messages
 */
export const getOCRErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'An unknown error occurred during OCR processing.';
  }
  
  const { message } = error;
  
  if (message.includes('insufficient text')) {
    return 'OCR could not extract enough readable text from the PDF. Try uploading a clearer image or entering the text manually.';
  }
  
  if (message.includes('image') || message.includes('canvas')) {
    return 'There was a problem converting the PDF to an image for OCR. Try using a screenshot of the recipe instead.';
  }
  
  return `OCR processing error: ${message}`;
};
