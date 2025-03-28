
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
  
  if (message.includes('memory') || message.includes('out of memory')) {
    return 'Your browser ran out of memory while processing this PDF. Try using a smaller file or just a screenshot of the recipe portion.';
  }
  
  if (message.includes('cancelled') || message.includes('aborted')) {
    return 'PDF processing was cancelled.';
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
  
  if (message.includes('memory') || message.includes('out of memory')) {
    return 'Your browser ran out of memory while processing the image. Try using a smaller or simpler image.';
  }
  
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'OCR processing took too long and timed out. Try with a simpler image or enter the text manually.';
  }
  
  if (message.includes('network') || message.includes('connection')) {
    return 'Network error during OCR processing. Please check your internet connection and try again.';
  }
  
  if (message.includes('cancelled') || message.includes('aborted')) {
    return 'OCR processing was cancelled.';
  }
  
  return `OCR processing error: ${message}`;
};

/**
 * Get file validation error messages
 */
export const getFileValidationErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'The file could not be processed due to an unknown error.';
  }
  
  const { message } = error;
  
  if (message.includes('too large')) {
    return 'This file is too large to process in the browser. Please try a smaller file.';
  }
  
  if (message.includes('type') || message.includes('format')) {
    return 'Unsupported file format. Please try a different file type.';
  }
  
  return `File validation error: ${message}`;
};
