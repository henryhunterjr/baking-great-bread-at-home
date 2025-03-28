
import { logInfo, logError } from '@/utils/logger';
import { Tesseract } from './tesseract-service';
import { ProgressCallback } from '../types';

/**
 * Verify if OCR is available in the current environment
 * @returns True if OCR is available
 */
export const verifyOCRAvailability = async (): Promise<boolean> => {
  try {
    // Check if Tesseract.js is available
    await Tesseract.checkAvailability();
    return true;
  } catch (error) {
    logError('OCR is not available in this environment', { error });
    return false;
  }
};

/**
 * Extract text from an image using OCR
 * @param imageFile Image file to process
 * @param progressCallback Optional callback for progress updates
 * @returns Extracted text as a string
 */
export const extractTextWithOCR = async (
  imageFile: File,
  progressCallback?: ProgressCallback
): Promise<string> => {
  try {
    logInfo('Starting OCR processing of image', { filename: imageFile.name, fileSize: imageFile.size });
    
    // Validate image file
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('File is not a valid image type');
    }
    
    // Convert the image file to a format Tesseract can process
    const imageURL = URL.createObjectURL(imageFile);
    
    try {
      // Process the image with OCR
      const result = await Tesseract.recognize(
        imageURL,
        {
          logger: (data) => {
            if (progressCallback && 'progress' in data) {
              progressCallback(data.progress);
            }
          }
        }
      );
      
      const extractedText = result.data.text;
      logInfo('OCR processing completed successfully', { 
        filename: imageFile.name, 
        textLength: extractedText.length 
      });
      
      return extractedText;
    } finally {
      // Clean up the object URL to avoid memory leaks
      URL.revokeObjectURL(imageURL);
    }
  } catch (error) {
    logError('OCR processing failed', { error, filename: imageFile.name });
    throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};
