
import { logInfo, logError } from '@/utils/logger';
import { loadPdfDocument } from './pdf-loader';
import { extractTextFromPages } from './text-extractor';
import { attemptOCRFallback } from './ocr-fallback';
import { CancellableTask, ExtractTextResult, ProgressCallback } from './types';
import * as pdfjsLib from 'pdfjs-dist';

// Maximum number of pages to process for performance
const MAX_PAGES_TO_PROCESS = 8; // Reduced from 10 for better performance

/**
 * Extract text from a PDF file
 * @param file PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns The extracted text from the PDF or a cancellable task
 */
export const extractTextFromPDF = async (
  file: File,
  progressCallback?: ProgressCallback
): Promise<ExtractTextResult> => {
  let isRequestCancelled = false;
  let pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;
  
  // Create a cancellable task
  const cancellableTask: CancellableTask = {
    cancel: () => {
      isRequestCancelled = true;
      if (pdfDocument) {
        try {
          pdfDocument.destroy();
        } catch (e) {
          logError("Error destroying PDF document", { error: e });
        }
      }
    }
  };
  
  try {
    // Set initial progress
    if (progressCallback) progressCallback(10);
    
    // Validate file size before processing
    if (file.size > 25 * 1024 * 1024) { // 25MB limit - increased from 15MB
      throw new Error("PDF file is too large (max 25MB). Try using a smaller file or text input.");
    }
    
    // Use a longer timeout for initial loading (30 seconds - increased from 12)
    pdfDocument = await loadPdfDocument(file, 30000);
    
    // Check if processing was cancelled during loading
    if (isRequestCancelled) {
      throw new Error('PDF processing was cancelled');
    }
    
    if (progressCallback) progressCallback(20);
    
    // Limit the number of pages to process
    const pagesToProcess = Math.min(pdfDocument.numPages, MAX_PAGES_TO_PROCESS);
    logInfo("PDF processing: Processing first pages", { pagesToProcess });
    
    // Extract text with a page limit
    const fullText = await extractTextFromPages(
      pdfDocument, 
      pagesToProcess, 
      progressCallback
    );
    
    // Clean up PDF document resources
    if (pdfDocument) {
      try {
        pdfDocument.destroy();
        pdfDocument = null;
      } catch (e) {
        logError("Error destroying PDF document", { error: e });
      }
    }
    
    // Check if we extracted meaningful text
    if (fullText.trim().length < 50) {
      // Not enough text was extracted, likely a scanned PDF
      logInfo("PDF processing: Not enough text extracted, falling back to OCR", { length: fullText.length });
      
      // Fall back to OCR
      if (progressCallback) progressCallback(70);
      const ocrText = await attemptOCRFallback(file, progressCallback);
      return ocrText.trim() || "No text could be extracted from this PDF. Try another file or input method.";
    }
    
    if (progressCallback) progressCallback(100);
    
    // Return extracted text
    return fullText.trim() || "No text could be extracted from this PDF. Try another file or input method.";
  } catch (error) {
    // Clean up resources if they still exist
    if (pdfDocument) {
      try {
        pdfDocument.destroy();
      } catch (e) {
        logError("Error destroying PDF document during error handling", { error: e });
      }
    }
    
    // Log the error
    logError('Error extracting text from PDF:', { error });
    
    // If cancelled, don't try OCR fallback
    if (isRequestCancelled) {
      throw new Error('PDF processing was cancelled');
    }
    
    // Try OCR as fallback for any error
    try {
      logInfo("PDF processing: Standard extraction failed, attempting OCR fallback");
      if (progressCallback) progressCallback(60);
      const ocrText = await attemptOCRFallback(file, progressCallback);
      
      if (!ocrText || ocrText.trim().length < 20) {
        return "Limited text could be extracted from this PDF. The quality may be too low or it may contain mostly images. Try manually typing the recipe.";
      }
      
      return ocrText || "No text could be extracted from this PDF. Try another file or input method.";
    } catch (ocrError) {
      logError('OCR fallback also failed:', { error: ocrError });
      
      // Provide better error message based on the failure type
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          throw new Error('PDF processing timed out. The file may be too large or complex. Try a simpler PDF or use text input instead.');
        } else if (error.message.includes('password')) {
          throw new Error('This PDF appears to be password protected. Please provide an unprotected PDF.');
        } else if (error.message.includes('worker') || error.message.includes('network')) {
          throw new Error('PDF processing failed due to network issues. Please check your connection and try again.');
        }
      }
      
      throw new Error('Failed to extract text from PDF: ' + (error instanceof Error ? error.message : 'Unknown error') + '. Try using a different file or method.');
    }
  }
  
  // Return the cancellable task if we reach this point (should not normally happen)
  return cancellableTask;
};
