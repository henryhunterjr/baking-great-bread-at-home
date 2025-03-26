
import { logInfo, logError } from '@/utils/logger';
import { createWorker } from 'tesseract.js';
import { ProgressCallback } from './types';

// Tesseract.js worker instance
let tesseractWorker: any = null;
let isInitializing = false;
let isInitialized = false;

// Initialize the OCR service with proper error handling
const initializeOCR = async (): Promise<boolean> => {
  if (isInitialized && tesseractWorker) {
    return true;
  }
  
  if (isInitializing) {
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return isInitialized;
  }
  
  try {
    isInitializing = true;
    logInfo('Initializing OCR service (Tesseract.js)');
    
    // Clean up any existing worker
    if (tesseractWorker) {
      try {
        await tesseractWorker.terminate();
        tesseractWorker = null;
      } catch (error) {
        logError('Error terminating existing Tesseract worker', { error });
        // Continue with initialization
      }
    }
    
    // Create a new worker with proper logger configuration
    tesseractWorker = await createWorker({
      logger: (progress: any) => {
        if (progress.status === 'recognizing text') {
          const progressPercent = Math.round(progress.progress * 100);
          logInfo(`OCR Progress: ${progressPercent}%`);
        }
      }
    });
    
    // Load English language data
    await tesseractWorker.loadLanguage('eng');
    await tesseractWorker.initialize('eng');
    
    // Log successful initialization
    logInfo('OCR service successfully initialized');
    isInitialized = true;
    return true;
  } catch (error) {
    logError('Error initializing OCR service', { error });
    isInitialized = false;
    tesseractWorker = null;
    return false;
  } finally {
    isInitializing = false;
  }
};

// Function to verify OCR availability
export const verifyOCRAvailability = async (): Promise<boolean> => {
  try {
    return await initializeOCR();
  } catch (error) {
    logError('OCR service unavailable', { error });
    return false;
  }
};

/**
 * Process an image file with OCR to extract text 
 * @param imageFile - The image file to process
 * @param progressCallback - Optional callback for progress updates
 * @returns The extracted text
 */
export const processImageWithOCR = async (
  imageFile: File | Blob | string,
  progressCallback?: ProgressCallback
): Promise<string> => {
  // Start progress reporting
  if (progressCallback) progressCallback(10);
  
  try {
    // Initialize OCR if not already initialized
    const isOCRReady = await initializeOCR();
    
    if (!isOCRReady || !tesseractWorker) {
      throw new Error("OCR service failed to initialize");
    }
    
    if (progressCallback) progressCallback(20);
    
    // Convert file to image data URL if it's not already a string
    const imageDataUrl = typeof imageFile === 'string' 
      ? imageFile 
      : await fileToDataURL(imageFile);
    
    if (progressCallback) progressCallback(30);
    
    // Configure Tesseract for recipe text
    await tesseractWorker.setParameters({
      tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,;:\'"-()[]{}!?@#$%^&*+=/<>°℃℉½¼¾⅓⅔ ',
      tessedit_pageseg_mode: 6, // Assume a single uniform block of text
    });
    
    if (progressCallback) progressCallback(40);
    
    // Recognize text with progress tracking
    const result = await tesseractWorker.recognize(imageDataUrl, {
      progress: (progress: any) => {
        // Map Tesseract's 0-1 progress to our 40-90 range
        if (progressCallback && progress.progress !== undefined) {
          const mappedProgress = 40 + Math.round(progress.progress * 50);
          progressCallback(mappedProgress);
        }
      }
    });
    
    if (progressCallback) progressCallback(90);
    
    // Extract and clean the text
    const extractedText = result.data.text || '';
    const cleanedText = cleanOCRText(extractedText);
    
    if (progressCallback) progressCallback(100);
    
    return cleanedText;
  } catch (error) {
    logError('Error processing image with OCR', { error });
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Clean up OCR text by removing excessive whitespace and fixing common OCR errors
const cleanOCRText = (text: string): string => {
  // Remove excessive whitespace
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Fix common OCR errors
  cleaned = cleaned
    .replace(/l\/2/g, '1/2')  // Fix for half fraction
    .replace(/l\/4/g, '1/4')  // Fix for quarter fraction
    .replace(/l\/3/g, '1/3')  // Fix for third fraction
    .replace(/0\/2/g, '1/2')  // Another common OCR error for fractions
    .trim();
  
  return cleaned;
};

// Convert a file to a data URL
const fileToDataURL = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Ensure the OCR service is properly cleaned up
export const cleanupOCR = async (): Promise<void> => {
  if (tesseractWorker) {
    try {
      await tesseractWorker.terminate();
      tesseractWorker = null;
      isInitialized = false;
      logInfo('OCR service cleaned up');
    } catch (error) {
      logError('Error cleaning up OCR service', { error });
    }
  }
};

// Export the function with the name that other modules are expecting
export const extractTextWithOCR = processImageWithOCR;

// Auto-cleanup on module unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (tesseractWorker) {
      tesseractWorker.terminate().catch(console.error);
    }
  });
}
