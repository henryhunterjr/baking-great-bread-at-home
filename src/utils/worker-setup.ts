
import { logInfo, logError } from './logger';

/**
 * Initialize workers for PDF.js and Tesseract.js
 * This should be called early in the application lifecycle
 */
export const initializeWorkers = (): void => {
  try {
    // Set up PDF.js worker
    setupPDFWorker();
    
    // Set up Tesseract worker (if needed)
    setupTesseractWorker();
    
    logInfo('Workers initialized successfully');
  } catch (error) {
    logError('Error initializing workers', { error });
  }
};

/**
 * Set up the PDF.js worker
 */
const setupPDFWorker = (): void => {
  try {
    // Add fallback for PDF.js worker
    // This makes the worker available globally so PDF.js can find it
    if (typeof window !== 'undefined') {
      // Try to use local worker first
      (window as any).pdfjsWorkerSrc = '/pdf.worker.min.js';
      
      // Add a fallback to CDN in case local worker fails
      window.addEventListener('error', (event) => {
        // Check if error is related to PDF.js worker
        if (event.filename?.includes('pdf.worker.min.js')) {
          logInfo('PDF worker load failed, using CDN fallback');
          (window as any).pdfjsWorkerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
      }, { once: true });
    }
  } catch (error) {
    logError('Error setting up PDF worker', { error });
  }
};

/**
 * Set up the Tesseract worker
 */
const setupTesseractWorker = (): void => {
  try {
    // Add fallback for Tesseract worker
    if (typeof window !== 'undefined') {
      // Provide a CDN fallback for tesseract worker
      // This is only needed if we don't include the worker in our build
      (window as any).tesseractWorkerSrc = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.0/dist/worker.min.js';
      (window as any).tesseractCorePath = 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.0.0/tesseract-core.wasm.js';
    }
  } catch (error) {
    logError('Error setting up Tesseract worker', { error });
  }
};

/**
 * Check if a worker is available by trying to fetch it
 * @param url Worker URL to check
 * @returns Promise resolving to boolean indicating if worker is available
 */
export const checkWorkerAvailability = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    logError(`Worker not available at ${url}`, { error });
    return false;
  }
};
