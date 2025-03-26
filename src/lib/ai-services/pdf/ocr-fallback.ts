
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
    logInfo("PDF processing: Normal extraction failed, trying OCR fallback", {
      fileName: file.name,
      fileSize: file.size
    });
    
    // Update progress if callback provided
    if (progressCallback) progressCallback(75);
    
    // Convert first page of PDF to image with shorter timeout
    const imageDataUrl = await convertPDFPageToImage(file, 10000);
    
    if (progressCallback) progressCallback(85);
    
    // Perform OCR on the image
    const extractedText = await extractTextWithOCR(imageDataUrl, (ocrProgress) => {
      // Map OCR progress from 85% to 100%
      if (progressCallback) {
        progressCallback(85 + (ocrProgress * 0.15));
      }
    });
    
    logInfo("PDF processing: OCR fallback complete", { textLength: extractedText.length });
    return extractedText;
  } catch (ocrError) {
    logError('OCR fallback failed:', { error: ocrError });
    
    // Provide a more helpful error message
    let errorMessage = 'Failed to extract text via OCR';
    if (ocrError instanceof Error) {
      errorMessage += ': ' + ocrError.message;
      if (ocrError.message.includes('timed out')) {
        errorMessage += '. The PDF might be too complex or large to process in the browser.';
      }
    }
    
    throw new Error(errorMessage);
  }
};
