
import { Tesseract } from './tesseract-service';
import { cleanupOCR } from './ocr-service';
import { logInfo, logError, startPerformanceTimer, endPerformanceTimer } from '@/utils/logger';
import { calculateTimeout } from './ocr-utils';

/**
 * Check if OCR is available in the current environment
 */
export const verifyOCRAvailability = async (): Promise<boolean> => {
  try {
    return await Tesseract.checkAvailability();
  } catch (error) {
    logError('OCR availability check failed', { error });
    return false;
  }
};

/**
 * Extract text from an image using OCR
 * 
 * @param imageFile The image file to process
 * @param progressCallback Optional callback for progress updates
 * @param options Additional options including AbortSignal for cancellation
 * @returns Extracted text
 */
export const extractTextWithOCR = async (
  imageFile: File,
  progressCallback?: (progress: number) => void,
  options: {
    signal?: AbortSignal
  } = {}
): Promise<string> => {
  const perfMarkerId = `ocr-${Date.now()}`;
  startPerformanceTimer(perfMarkerId);
  
  try {
    // Validate input
    if (!imageFile) {
      throw new Error('No image file provided for OCR');
    }
    
    // Log OCR start with file details
    logInfo('Starting OCR text extraction', { 
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    });
    
    // Create a throttled progress updater callback
    const updateProgress = (status: any) => {
      if (status && status.progress !== undefined && progressCallback) {
        progressCallback(status.progress * 100);
      }
    };
    
    // Check if operation was cancelled before starting
    if (options.signal?.aborted) {
      throw new Error('OCR operation cancelled before starting');
    }
    
    // Process image with Tesseract
    const result = await Tesseract.recognize(imageFile, {
      logger: updateProgress,
      signal: options.signal
    });
    
    // Extract and clean text from result
    let extractedText = result.data.text || '';
    
    // Clean the OCR text to improve quality
    extractedText = cleanupOCR(extractedText);
    
    // Calculate processing time
    const processingTime = endPerformanceTimer(
      perfMarkerId,
      'OCR text extraction',
      { textLength: extractedText.length }
    );
    
    logInfo('OCR extraction completed', {
      processingTimeMs: processingTime,
      textLength: extractedText.length
    });
    
    return extractedText;
  } catch (error) {
    // Special handling for cancellation
    if (options.signal?.aborted) {
      logInfo('OCR extraction cancelled by user');
      throw new Error('OCR operation was cancelled');
    }
    
    // Log and rethrow all other errors
    logError('OCR extraction failed', { error });
    
    // Calculate total time even for errors
    endPerformanceTimer(perfMarkerId, 'OCR extraction (failed)');
    
    throw error;
  }
};
