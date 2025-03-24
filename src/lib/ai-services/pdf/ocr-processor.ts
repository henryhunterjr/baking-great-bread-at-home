
import { createWorker, createScheduler, type RecognizeResult } from 'tesseract.js';

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
  try {
    // Start progress at 10%
    progressCallback(10);
    
    // Initialize Tesseract worker with English language
    const worker = await createWorker('eng');
    
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
    
    // In Tesseract.js v6, progress monitoring is handled differently
    // We'll set up a simple progress estimation
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      // Estimate progress between 20-90% based on time (max 20 seconds)
      const progress = Math.min(90, 20 + Math.floor((elapsed / 20000) * 70));
      progressCallback(progress);
    }, 500);
    
    // Recognize text from the image
    const result = await worker.recognize(imageData);
    
    // Clear progress interval
    clearInterval(progressInterval);
    
    // Get text from the result
    const extractedText = result.data.text || '';
    
    // Clean up the text
    const cleanedText = cleanUpOCRText(extractedText);
    
    // Terminate the worker to free resources
    await worker.terminate();
    
    // Set to 100% complete
    progressCallback(100);
    
    return cleanedText;
  } catch (error) {
    console.error('OCR processing error:', error);
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
    reader.onerror = reject;
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
