
import { createWorker } from 'tesseract.js';
import { logInfo, logError } from '@/utils/logger';

type ProgressCallback = (progress: number) => void;

/**
 * Extract text from an image file using OCR with enhanced reliability
 */
export const extractTextWithOCR = async (
  imageSource: File | string,
  progressCallback: ProgressCallback = () => {}
): Promise<string> => {
  let worker: any = null;
  let canceled = false;
  
  try {
    // Start progress at 10%
    progressCallback(10);
    logInfo("OCR: Initializing Tesseract worker");
    
    // Initialize worker with better error handling and timeout management
    try {
      worker = await Promise.race([
        createWorker('eng'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Worker initialization timed out')), 30000)
        )
      ]);
    } catch (initError) {
      logError("OCR: Worker initialization failed", { error: initError });
      throw new Error(`OCR engine initialization failed: ${initError instanceof Error ? initError.message : 'Unknown error'}`);
    }
    
    progressCallback(30);
    logInfo("OCR: Worker initialized successfully");
    
    // Process the image (File or dataURL)
    let imageData: string | Uint8Array;
    
    try {
      if (typeof imageSource === 'string') {
        // If already a data URL, use directly
        imageData = imageSource;
      } else {
        // If it's a File, read as array buffer for better compatibility
        const arrayBuffer = await imageSource.arrayBuffer();
        imageData = new Uint8Array(arrayBuffer);
      }
    } catch (imageError) {
      logError("OCR: Image preparation failed", { error: imageError });
      throw new Error(`Failed to prepare image for OCR: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`);
    }
    
    logInfo("OCR: Image prepared, starting recognition");
    
    // Begin recognition with progress monitoring
    const recognizeResult = worker.recognize(imageData);
    
    // Set up more detailed progress tracking
    if (recognizeResult.progress) {
      recognizeResult.progress(p => {
        if (canceled) return;
        
        // Map progress (0-1) to our range (30-90%)
        const mappedProgress = Math.floor(30 + (p * 60));
        progressCallback(mappedProgress);
        
        // Log progress milestones
        if (p === 0.25 || p === 0.5 || p === 0.75 || p === 1) {
          logInfo(`OCR: Recognition progress: ${Math.round(p * 100)}%`);
        }
      });
    }
    
    // Add a timeout for recognition to prevent hanging
    const result = await Promise.race([
      recognizeResult,
      new Promise((_, reject) => 
        setTimeout(() => {
          reject(new Error('OCR recognition timed out after 120 seconds'));
          canceled = true;
        }, 120000)
      )
    ]);
    
    // Get text from the result
    const extractedText = result.data.text || '';
    
    // Clean up the text
    const cleanedText = cleanUpOCRText(extractedText);
    
    // Set to 100% complete
    progressCallback(100);
    logInfo("OCR: Recognition complete", { 
      originalTextLength: extractedText.length,
      cleanedTextLength: cleanedText.length
    });
    
    // Check if we got meaningful text
    if (cleanedText.trim().length < 50) {
      logError("OCR: Extracted text too short or empty", { 
        textLength: cleanedText.length
      });
      
      if (cleanedText.trim().length === 0) {
        throw new Error("OCR couldn't detect any text in the image. Please try with a clearer image.");
      } else {
        logInfo("OCR: Found minimal text, but proceeding", { 
          text: cleanedText
        });
      }
    }
    
    // Terminate the worker to free resources
    if (worker) {
      try {
        await worker.terminate();
        worker = null;
        logInfo("OCR: Worker terminated successfully");
      } catch (terminateError) {
        logError("OCR: Error terminating worker", { error: terminateError });
        // Non-critical error, continue
      }
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
    
    // Provide a more specific error message based on the error type
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('timed out')) {
        throw new Error("OCR processing took too long. Try using a smaller or clearer image.");
      } else if (error.message.includes('memory')) {
        throw new Error("OCR processing ran out of memory. Try using a smaller image or different input method.");
      } else if (error.message.includes('initialization')) {
        throw new Error("Failed to initialize OCR engine. Please try again or use a different input method.");
      }
    }
    
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Clean up OCR extracted text with improved quality
 */
const cleanUpOCRText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/\r\n/g, '\n')                 // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')             // Replace multiple line breaks with just two
    .replace(/[\t ]+/g, ' ')                // Replace multiple spaces/tabs with a single space
    .replace(/^\s+|\s+$/gm, '')             // Trim leading/trailing whitespace from each line
    .replace(/(\d)l(\s|$)/g, '$1l$2')       // Fix common OCR errors with numbers
    .replace(/(\d),(\d)/g, '$1.$2')         // Fix decimal points misread as commas
    .replace(/(\d+)\/(\d+)/g, '$1/$2')      // Fix fractions
    .replace(/lngredients/gi, 'Ingredients') // Fix common recipe words
    .replace(/D1rections/gi, 'Directions')
    .replace(/[Ii]nstructions?:/g, 'Instructions:')
    .trim();                                // Trim the entire text
};

/**
 * Verify if OCR service is available and working
 */
export const verifyOCRAvailability = async (): Promise<boolean> => {
  try {
    // Create a small worker to test if Tesseract is working
    const testWorker = await createWorker('eng', {
      logger: () => {} // Silence logger for test
    });
    
    // Terminate test worker immediately
    await testWorker.terminate();
    logInfo("OCR service availability verified successfully");
    return true;
  } catch (error) {
    logError("OCR service availability check failed", { error });
    return false;
  }
};
