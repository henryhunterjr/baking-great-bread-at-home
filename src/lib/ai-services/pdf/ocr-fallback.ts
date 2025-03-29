
import { extractTextWithOCR } from './ocr/ocr-processor';
import { logInfo, logError } from '@/utils/logger';
import { ProgressCallback } from './types';

/**
 * Attempt to extract text using OCR when PDF text extraction fails
 * 
 * @param file The PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns The extracted text from OCR processing
 */
export const attemptOCRFallback = async (
  file: File,
  progressCallback?: ProgressCallback
): Promise<string> => {
  try {
    logInfo('PDF text extraction failed, attempting OCR fallback');
    
    // Report initial progress for fallback process
    if (progressCallback) {
      progressCallback(0.5); // Start at 50% since we're halfway through the process
    }
    
    // Convert first page of PDF to image and then use OCR
    // This is a simplified version - in production, we'd use a library 
    // to render PDF pages to images and then process with OCR
    
    // For now, we'll just use OCR directly on the PDF file
    // This isn't ideal but provides a fallback mechanism
    const ocrText = await extractTextWithOCR(
      file,
      progress => {
        if (progressCallback) {
          // Map OCR progress to overall progress (50%-100%)
          progressCallback(0.5 + (progress * 0.5));
        }
      }
    );
    
    if (!ocrText || typeof ocrText !== 'string') {
      throw new Error('OCR processing failed to return valid text');
    }
    
    // Complete progress
    if (progressCallback) {
      progressCallback(1.0);
    }
    
    logInfo('OCR fallback extraction complete', { 
      textLength: ocrText.length 
    });
    
    return ocrText;
  } catch (error) {
    logError('OCR fallback failed', { error });
    throw new Error('Failed to extract text using OCR fallback: ' + 
      (error instanceof Error ? error.message : String(error)));
  }
};
