
import { createWorker, Worker, RecognizeResult } from 'tesseract.js';

interface ProgressCallback {
  (progress: number): void;
}

/**
 * Extract text from an image file using OCR
 */
export const extractTextWithOCR = async (
  imageFile: File,
  progressCallback: ProgressCallback = () => {}
): Promise<string> => {
  let worker: Worker;
  
  try {
    // Initialize Tesseract worker with proper logging configuration
    worker = await createWorker('eng');
    
    // Set up progress handler (compatible with Tesseract.js v6)
    worker.setLogger(m => {
      if (m.status === 'recognizing text') {
        const progress = Math.round(m.progress * 100);
        progressCallback(progress);
      }
    });
    
    // Start progress at 10%
    progressCallback(10);
    
    // Process the image file
    const imageData = await readFileAsImageData(imageFile);
    
    // Recognize text from the image
    const result = await worker.recognize(imageData);
    
    // Get text from the result
    const extractedText = result.data.text || '';
    
    // Clean up the text
    const cleanedText = cleanUpOCRText(extractedText);
    
    // Terminate the worker to free resources
    await worker.terminate();
    
    return cleanedText;
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Read a file as image data
 */
const readFileAsImageData = (file: File): Promise<string | ArrayBuffer> => {
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
