
import { logInfo, logError } from '@/utils/logger';
import { extractTextWithOCR } from './ocr-processor';
import { convertPDFPageToImage } from './pdf-image-converter';
import { ProgressCallback } from './types';

/**
 * Attempt OCR extraction as a fallback when normal text extraction fails
 * @param file The PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns The text extracted via OCR
 */
export const attemptOCRFallback = async (
  file: File,
  progressCallback?: ProgressCallback
): Promise<string> => {
  try {
    logInfo("PDF processing: Normal extraction failed, trying OCR fallback");
    
    // Update progress if callback provided
    if (progressCallback) progressCallback(90);
    
    // Convert first page of PDF to image
    const imageDataUrl = await convertPDFPageToImage(file);
    
    // Perform OCR on the image
    const extractedText = await extractTextWithOCR(imageDataUrl, (ocrProgress) => {
      // Map OCR progress from 90% to 100%
      if (progressCallback) {
        progressCallback(90 + (ocrProgress / 10));
      }
    });
    
    logInfo("PDF processing: OCR fallback complete", { textLength: extractedText.length });
    return extractedText;
  } catch (ocrError) {
    logError('OCR fallback failed:', ocrError);
    throw new Error('Failed to extract text via OCR: ' + 
      (ocrError instanceof Error ? ocrError.message : 'Unknown error'));
  }
};
