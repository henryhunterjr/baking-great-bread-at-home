
import { createWorker } from 'tesseract.js';
import { logInfo, logError } from '@/utils/logger';

type ProgressCallback = (progress: number) => void;

/**
 * Extract text from an image file using OCR
 */
export const extractTextWithOCR = async (
  imageSource: File | string,
  progressCallback: ProgressCallback = () => {}
): Promise<string> => {
  let worker: any = null;
  
  try {
    // Start progress at 10%
    progressCallback(10);
    logInfo("OCR: Initializing Tesseract worker");
    
    // Initialize worker and load language
    worker = await createWorker('eng');
    
    progressCallback(30);
    
    // Process the image (File or dataURL)
    let imageData: string | Uint8Array;
    
    if (typeof imageSource === 'string') {
      // If already a data URL, use directly
      imageData = imageSource;
    } else {
      // If it's a File, read as array buffer for better compatibility
      const arrayBuffer = await imageSource.arrayBuffer();
      imageData = new Uint8Array(arrayBuffer);
    }
    
    // Set progress to 30% after preparing image
    logInfo("OCR: Image prepared, starting recognition");
    
    // Begin recognition with progress monitoring
    const recognizeResult = worker.recognize(imageData);
    
    // Monitor progress if the API supports it
    if (recognizeResult.progress) {
      recognizeResult.progress(p => {
        // Map progress (0-1) to our range (30-90%)
        const mappedProgress = Math.floor(30 + (p * 60));
        progressCallback(mappedProgress);
      });
    }
    
    // Get the result
    const result = await recognizeResult;
    
    // Get text from the result
    const extractedText = result.data.text || '';
    
    // Clean up the text
    const cleanedText = cleanUpOCRText(extractedText);
    
    // Set to 100% complete
    progressCallback(100);
    logInfo("OCR: Recognition complete");
    
    // Terminate the worker to free resources
    if (worker) {
      await worker.terminate();
      worker = null;
    }
    
    return cleanedText;
  } catch (error) {
    logError('OCR processing error:', { error });
    
    // Always clean up resources on error
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        logError('Error terminating Tesseract worker:', { error: e });
      }
    }
    
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Clean up OCR extracted text
 */
const cleanUpOCRText = (text: string): string => {
  return text
    .replace(/\r\n/g, '\n')               // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')           // Replace multiple line breaks with just two
    .replace(/[\t ]+/g, ' ')              // Replace multiple spaces/tabs with a single space
    .replace(/^\s+|\s+$/gm, '')           // Trim leading/trailing whitespace from each line
    .trim();                               // Trim the entire text
};
