
import { createWorker, type RecognizeResult } from 'tesseract.js';
import { logInfo, logError } from '@/utils/logger';

interface ProgressCallback {
  (progress: number): void;
}

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
    
    // Initialize Tesseract worker with English language
    worker = await createWorker('eng', 1, {
      logger: m => {
        // Log progress messages from Tesseract
        if (m.status === 'recognizing text') {
          const progress = Math.floor(20 + (m.progress * 70));
          progressCallback(progress);
        }
      }
    });
    
    // Process the image (can be File or string/dataURL)
    let imageData: string;
    
    if (typeof imageSource === 'string') {
      // If already a data URL, use directly
      imageData = imageSource;
    } else {
      // If it's a File, convert to data URL
      imageData = await readFileAsImageData(imageSource);
    }
    
    // Set progress to 20% after preparing image
    progressCallback(20);
    logInfo("OCR: Image prepared, starting recognition");
    
    // Recognize text from the image with Tesseract.js v6 API
    const result = await worker.recognize(imageData);
    
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
    logError('OCR processing error:', error);
    
    // Always clean up resources on error
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        logError('Error terminating Tesseract worker:', e);
      }
    }
    
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Read a file as image data
 */
const readFileAsImageData = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => {
      logError('Error reading file as image data:', error);
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  });
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
