
import { logInfo, logError } from '@/utils/logger';
import { loadPdfDocument } from './pdf-loader';
import { extractTextFromPages } from './text-extractor';
import { attemptOCRFallback } from './ocr-fallback';
import { CancellableTask, ExtractTextResult, ProgressCallback } from './types';
import * as pdfjsLib from 'pdfjs-dist';

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
          logError("Error destroying PDF document", e);
        }
      }
    }
  };
  
  try {
    // Set initial progress
    if (progressCallback) progressCallback(10);
    
    // Load the PDF document
    pdfDocument = await loadPdfDocument(file);
    
    // Check if processing was cancelled during loading
    if (isRequestCancelled) {
      throw new Error('PDF processing was cancelled');
    }
    
    if (progressCallback) progressCallback(20);
    
    // Fix: Pass the progressCallback properly
    // extractTextFromPages expects a ProgressCallback, not a number
    const fullText = await extractTextFromPages(pdfDocument, progressCallback);
    
    // Clean up PDF document resources
    if (pdfDocument) {
      try {
        pdfDocument.destroy();
        pdfDocument = null;
      } catch (e) {
        logError("Error destroying PDF document", e);
      }
    }
    
    // Check if we extracted meaningful text
    if (fullText.trim().length < 50) {
      // Not enough text was extracted, likely a scanned PDF
      logInfo("PDF processing: Not enough text extracted, falling back to OCR");
      
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
        logError("Error destroying PDF document during error handling", e);
      }
    }
    
    // Log the error
    logError('Error extracting text from PDF:', error);
    
    // If cancelled, don't try OCR fallback
    if (isRequestCancelled) {
      throw new Error('PDF processing was cancelled');
    }
    
    // Try OCR as fallback for any error
    try {
      if (progressCallback) progressCallback(60);
      const ocrText = await attemptOCRFallback(file, progressCallback);
      return ocrText || "No text could be extracted from this PDF. Try another file or input method.";
    } catch (ocrError) {
      logError('OCR fallback also failed:', ocrError);
      throw new Error('Failed to extract text from PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
  
  // Return the cancellable task if we reach this point (should not normally happen)
  return cancellableTask;
};
