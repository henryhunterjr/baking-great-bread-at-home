
import { logInfo, logError } from '@/utils/logger';
import { loadPdfDocument } from './pdf-loader';
import { extractTextFromPages } from './text-extractor';
import { attemptOCRFallback } from './ocr-fallback';
import { CancellableTask, ExtractTextResult, ProgressCallback } from './types';
import * as pdfjsLib from 'pdfjs-dist';
import { ensurePDFWorkerFiles, configurePDFWorkerCORS } from './pdf-worker-service';

// Maximum number of pages to process for performance
const MAX_PAGES_TO_PROCESS = 3; // Reduced from 5 to improve performance and timeout issues

// Timeout for PDF processing steps (in milliseconds)
const PDF_LOAD_TIMEOUT = 12000; // 12 seconds for loading (reduced from 15)
const PDF_TOTAL_TIMEOUT = 25000; // 25 seconds total (reduced from 30)

// Initialize the PDF worker service and CORS configuration on module load
Promise.all([
  ensurePDFWorkerFiles(),
  configurePDFWorkerCORS()
]).catch(error => 
  logError('Failed to initialize PDF worker service', { error })
);

/**
 * Extract text from a PDF file with enhanced reliability and error handling
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
  let timeoutId: number | null = null;
  
  // Create a cancellable task
  const cancellableTask: CancellableTask = {
    cancel: () => {
      isRequestCancelled = true;
      
      // Clear any existing timeout
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      // Clean up PDF document
      if (pdfDocument) {
        try {
          pdfDocument.destroy();
          pdfDocument = null;
        } catch (e) {
          logError("Error destroying PDF document during cancellation", { error: e });
        }
      }
    }
  };
  
  try {
    // Set initial progress
    if (progressCallback) progressCallback(10);
    
    // Log the beginning of processing
    logInfo("PDF processing: Starting extraction", { 
      fileName: file.name, 
      fileSize: file.size,
      fileType: file.type 
    });
    
    // Validate file size before processing - reduced from 10MB to 8MB
    if (file.size > 8 * 1024 * 1024) {
      throw new Error("PDF file is too large (max 8MB). Try using a smaller file or text input.");
    }
    
    // Set a global timeout for the entire process
    timeoutId = window.setTimeout(() => {
      if (!isRequestCancelled) {
        isRequestCancelled = true;
        logError("PDF processing timed out after global timeout", {});
        if (pdfDocument) {
          try {
            pdfDocument.destroy();
            pdfDocument = null;
          } catch (e) {
            logError("Error destroying PDF document during timeout", { error: e });
          }
        }
      }
    }, PDF_TOTAL_TIMEOUT);
    
    // Add shorter timeout for initial loading
    try {
      pdfDocument = await loadPdfDocument(file, PDF_LOAD_TIMEOUT);
    } catch (loadError) {
      logError("PDF processing: Document loading failed", { error: loadError });
      
      // Try OCR as fallback immediately for loading errors
      if (progressCallback) progressCallback(60);
      logInfo("PDF processing: Document loading failed, attempting OCR fallback");
      
      if (isRequestCancelled) throw new Error('PDF processing was cancelled');
      
      const ocrText = await attemptOCRFallback(file, progressCallback);
      
      // Clear the timeout since we finished with OCR
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      return ocrText;
    }
    
    // Check if processing was cancelled during loading
    if (isRequestCancelled) {
      throw new Error('PDF processing was cancelled');
    }
    
    if (progressCallback) progressCallback(20);
    
    // Limit the number of pages to process - reduced from 5 to 3
    const pagesToProcess = Math.min(pdfDocument.numPages, MAX_PAGES_TO_PROCESS);
    logInfo("PDF processing: Processing pages", { 
      totalPages: pdfDocument.numPages,
      pagesToProcess 
    });
    
    // Extract text with a page limit
    const fullText = await extractTextFromPages(
      pdfDocument, 
      pagesToProcess, 
      progressCallback
    );
    
    // Check if processing was cancelled during extraction
    if (isRequestCancelled) {
      throw new Error('PDF processing was cancelled');
    }
    
    // Clean up PDF document resources
    if (pdfDocument) {
      try {
        pdfDocument.destroy();
        pdfDocument = null;
        logInfo("PDF processing: Document resources released");
      } catch (e) {
        logError("Error destroying PDF document", { error: e });
      }
    }
    
    // Clear the timeout since we finished successfully
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // Check if we extracted meaningful text
    if (fullText.trim().length < 50) {
      // Not enough text was extracted, likely a scanned PDF
      logInfo("PDF processing: Not enough text extracted, falling back to OCR", { length: fullText.length });
      
      // Fall back to OCR
      if (progressCallback) progressCallback(70);
      const ocrText = await attemptOCRFallback(file, progressCallback);
      
      if (ocrText.trim().length > 0) {
        logInfo("PDF processing: OCR fallback successful");
        return ocrText;
      } else {
        return "No text could be extracted from this PDF. The document may be empty, secured, or contain only images.";
      }
    }
    
    if (progressCallback) progressCallback(100);
    logInfo("PDF processing: Extraction complete successfully", { 
      extractedTextLength: fullText.length 
    });
    
    // Return extracted text
    return fullText.trim();
  } catch (error) {
    // Clean up resources if they still exist
    if (pdfDocument) {
      try {
        pdfDocument.destroy();
        pdfDocument = null;
      } catch (e) {
        logError("Error destroying PDF document during error handling", { error: e });
      }
    }
    
    // Clear any existing timeout
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
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
        return "Limited text could be extracted from this PDF. The quality may be too low or it may contain mostly images.";
      }
      
      return ocrText;
    } catch (ocrError) {
      logError('OCR fallback also failed:', { error: ocrError });
      
      // Provide better error message based on the failure type
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          throw new Error('PDF processing timed out. Please use a smaller or simpler PDF, or paste the recipe text directly.');
        } else if (error.message.includes('password')) {
          throw new Error('This PDF appears to be password protected. Please provide an unprotected PDF.');
        } else if (error.message.includes('worker') || error.message.includes('network')) {
          throw new Error('PDF processing failed due to network issues. Please check your connection and try again.');
        }
      }
      
      throw new Error('Unable to process this PDF. Please try extracting and pasting the text manually.');
    }
  }
  
  // Return the cancellable task if we reach this point (should not normally happen)
  return cancellableTask;
};
