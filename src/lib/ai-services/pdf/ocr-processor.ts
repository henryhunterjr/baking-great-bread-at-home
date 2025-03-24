
import { createWorker } from 'tesseract.js';
import { convertPDFPageToImage } from './pdf-image-converter';
import { logDebug, logError, logInfo } from '@/utils/logger';

/**
 * Use OCR to extract text from a PDF that's likely scanned
 * @param file PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns The OCR-extracted text
 */
export const extractTextWithOCR = async (
  file: File,
  progressCallback?: (progress: number) => void
): Promise<string> => {
  try {
    if (progressCallback) progressCallback(40);
    
    logInfo("OCR processing: Initializing worker...");
    
    // Use the correct API format for Tesseract.js v4+
    const worker = await createWorker('eng');
    
    logInfo("OCR processing: Worker initialized");
    
    let lastProgress = 40;
    const updateProgress = () => {
      if (progressCallback && lastProgress < 90) {
        lastProgress += 5;
        progressCallback(lastProgress);
      }
    };
    
    // Set up regular progress updates
    const progressInterval = setInterval(updateProgress, 1000);
    
    // Convert the PDF to an image and recognize text
    // We're using a Data URL for more reliable handling
    let imageURL;
    try {
      logInfo("OCR processing: Converting PDF to image...");
      // Try to convert first page to image using a canvas (if browser supports it)
      imageURL = await convertPDFPageToImage(file);
      logInfo("OCR processing: Successfully converted PDF to image");
    } catch (err) {
      logError('Failed to convert PDF to image:', { error: err });
      // Just use the file directly as fallback
    }
    
    logInfo("OCR processing: Starting text recognition...");
    // Recognize text from the source (imageURL or file)
    const result = await worker.recognize(imageURL || file);
    
    logInfo("OCR processing: Text recognition complete");
    
    // Clear the interval
    clearInterval(progressInterval);
    
    // Clean up the worker
    await worker.terminate();
    
    if (progressCallback) progressCallback(100);
    
    return result.data.text || 'No text detected in the PDF.';
  } catch (error) {
    logError('Error performing OCR on PDF:', { error });
    throw new Error('Failed to perform OCR on PDF');
  }
};
