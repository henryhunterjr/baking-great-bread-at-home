
import { logInfo, logError } from '@/utils/logger';
import { loadPdfDocument } from '../pdf-loader';
import { extractTextFromPages } from '../text-extractor';
import { attemptOCRFallback } from '../ocr-fallback';
import { CancellableTask, ExtractTextResult, ProgressCallback } from '../types';
import * as pdfjsLib from 'pdfjs-dist';
import { safelyDestroyPdfDocument, clearTimeoutIfExists } from '../utils/cleanup-utils';
import { validatePdfFile, calculatePagesToProcess, PDF_LOAD_TIMEOUT, PDF_TOTAL_TIMEOUT } from '../utils/pdf-validator';
import { createCancellableTimeout } from '../utils/timeout-utils';
import { cleanPDFText } from '@/lib/recipe-conversion/cleaners';

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
      timeoutId = clearTimeoutIfExists(timeoutId);
      
      // Clean up PDF document
      safelyDestroyPdfDocument(pdfDocument, "cancellation");
      pdfDocument = null;
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
    
    // Validate file size before processing
    validatePdfFile(file);
    
    // Set a global timeout for the entire process
    const timeout = createCancellableTimeout(() => {
      if (!isRequestCancelled) {
        isRequestCancelled = true;
        logError("PDF processing timed out after global timeout", {});
        safelyDestroyPdfDocument(pdfDocument, "timeout");
        pdfDocument = null;
      }
    }, PDF_TOTAL_TIMEOUT);
    
    timeoutId = timeout.timeoutId;
    
    // Add shorter timeout for initial loading
    try {
      pdfDocument = await loadPdfDocument(file, PDF_LOAD_TIMEOUT);
    } catch (loadError) {
      logError("PDF processing: Document loading failed", { error: loadError });
      
      // Try OCR as fallback immediately for loading errors
      if (progressCallback) progressCallback(60);
      logInfo("PDF processing: Document loading failed, attempting OCR fallback");
      
      if (isRequestCancelled) throw new Error('PDF processing was cancelled');
      
      try {
        const ocrText = await attemptOCRFallback(file, progressCallback);
        
        // Clear the timeout since we finished with OCR
        timeoutId = clearTimeoutIfExists(timeoutId);
        
        return ocrText;
      } catch (ocrError) {
        throw new Error(`Failed to process PDF: ${ocrError instanceof Error ? ocrError.message : String(ocrError)}`);
      }
    }
    
    // Check if processing was cancelled during loading
    if (isRequestCancelled) {
      throw new Error('PDF processing was cancelled');
    }
    
    if (progressCallback) progressCallback(20);
    
    // Limit the number of pages to process
    const pagesToProcess = calculatePagesToProcess(pdfDocument.numPages);
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
    
    // Clean the text using our text cleaner
    const cleanedText = cleanPDFText(fullText);
    
    // Final progress update
    if (progressCallback) progressCallback(100);
    
    // Clean up PDF document
    safelyDestroyPdfDocument(pdfDocument, "success");
    pdfDocument = null;
    
    // Clear the timeout since we finished successfully
    timeoutId = clearTimeoutIfExists(timeoutId);
    
    return cleanedText;
  } catch (error) {
    // Clean up PDF document if it exists
    safelyDestroyPdfDocument(pdfDocument, "error");
    pdfDocument = null;
    
    // Clear the timeout
    timeoutId = clearTimeoutIfExists(timeoutId);
    
    logError("Error extracting text from PDF:", { error });
    
    // Cancel the task
    cancellableTask.cancel();
    
    // Throw a more user-friendly error
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to extract text from PDF due to an unknown error');
    }
  }
  
  // Return the cancellable task
  return cancellableTask;
};
