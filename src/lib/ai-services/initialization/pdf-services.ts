
import { logInfo, logError } from '@/utils/logger';
import { ensurePDFWorkerFiles, configurePDFWorkerCORS } from '../pdf/pdf-worker-service';
import { verifyOCRAvailability } from '../pdf/ocr/ocr-processor';

/**
 * Initialize PDF processing services
 */
export const initializePDFServices = async (): Promise<{
  pdfWorkerAvailable: boolean;
  ocrAvailable: boolean;
}> => {
  let pdfWorkerAvailable = false;
  let ocrAvailable = false;
  
  // Initialize PDF worker files with added error handling
  try {
    await ensurePDFWorkerFiles();
    configurePDFWorkerCORS();
    logInfo('✅ PDF worker service initialized');
    pdfWorkerAvailable = true;
  } catch (error) {
    logError('Error initializing PDF worker service', { error });
  }
  
  // Verify OCR availability with a more robust approach
  try {
    ocrAvailable = await verifyOCRAvailability();
    if (ocrAvailable) {
      logInfo('✅ OCR service initialized');
    } else {
      logError('OCR service initialization failed', { 
        error: 'Tesseract.js not available or initialization error'
      });
    }
  } catch (error) {
    logError('Error verifying OCR availability', { error });
  }
  
  return { pdfWorkerAvailable, ocrAvailable };
};
