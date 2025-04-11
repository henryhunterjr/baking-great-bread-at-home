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
 * Set up the PDF.js worker with multiple fallback strategies
 */
const setupPDFWorker = (): void => {
  try {
    if (typeof window !== 'undefined') {
      // Try all possible worker locations in order of preference
      const workerUrls = [
        '/pdf.worker.min.js',                            // Default path
        '/assets/pdf.worker.min.js',                     // Alternative path
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js', // CDN fallback
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js'  // Another CDN fallback
      ];
      
      // Set a default worker URL to start
      (window as any).pdfjsWorkerSrc = workerUrls[0];
      
      // Try to preload each worker URL and use the first one that works
      checkWorkersSequentially(workerUrls)
        .then(validUrl => {
          if (validUrl) {
            logInfo('PDF worker successfully located at', { workerUrl: validUrl });
            (window as any).pdfjsWorkerSrc = validUrl;
          } else {
            logError('No valid PDF worker found, using CDN fallback');
            (window as any).pdfjsWorkerSrc = workerUrls[2]; // Use CDN fallback
          }
        })
        .catch(() => {
          logError('Error checking worker availability, using CDN fallback');
          (window as any).pdfjsWorkerSrc = workerUrls[2]; // Use CDN fallback
        });
      
      // Add a global error event listener for worker load failures
      window.addEventListener('error', (event) => {
        // Check if error is related to PDF.js worker
        if (event.filename?.includes('pdf.worker') && event.message?.includes('failed')) {
          logError('PDF worker load failed in runtime, switching to CDN version', { 
            errorLocation: event.filename,
            errorMessage: event.message 
          });
          (window as any).pdfjsWorkerSrc = workerUrls[2]; // Switch to CDN fallback
        }
      }, { capture: true });
    }
  } catch (error) {
    logError('Error setting up PDF worker', { error });
  }
};

/**
 * Try loading workers sequentially until one works
 */
export const checkWorkersSequentially = async (urls: string[]): Promise<string | null> => {
  for (const url of urls) {
    try {
      const isAvailable = await checkWorkerAvailability(url);
      if (isAvailable) {
        return url;
      }
    } catch (error) {
      logError(`Worker not available at ${url}`, { error });
    }
  }
  return null;
};

/**
 * Set up the Tesseract worker
 */
const setupTesseractWorker = (): void => {
  try {
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
 * Check if a worker is available with timeout
 */
export const checkWorkerAvailability = async (url: string, timeout = 3000): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors' // Allow checking cross-origin resources
    });
    
    clearTimeout(timeoutId);
    return true; // If we got here without an error, assume the worker is available
  } catch (error) {
    if (error.name === 'AbortError') {
      logError(`Worker check timed out for ${url}`, { timeout });
    } else {
      logError(`Worker not available at ${url}`, { error });
    }
    return false;
  }
};

/**
 * Preload the worker files to ensure they're cached and ready
 */
export const preloadWorkers = (): void => {
  try {
    // Preload the PDF.js worker
    if (typeof window !== 'undefined') {
      // Try to preload from different potential locations
      const workerUrls = [
        '/pdf.worker.min.js',
        '/assets/pdf.worker.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      ];
      
      workerUrls.forEach(url => {
        fetch(url, { method: 'HEAD' })
          .then(() => logInfo(`Successfully preloaded worker from ${url}`))
          .catch(() => logInfo(`Failed to preload worker from ${url}`));
      });
    }
  } catch (error) {
    logError('Error preloading workers', { error });
  }
};

/**
 * Initialize a PDF.js library instance with the best available worker
 * This should be used by PDF processing functions to get a properly configured PDF.js instance
 */
export const initializePdfLib = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Dynamically import the PDF.js library
    const pdfJS = await import('pdfjs-dist');
    
    // Use the worker URL that was set during initialization
    if ((window as any).pdfjsWorkerSrc) {
      pdfJS.GlobalWorkerOptions.workerSrc = (window as any).pdfjsWorkerSrc;
    } else {
      // Fallback to CDN if no worker was set
      pdfJS.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    
    logInfo('PDF.js library initialized successfully');
    return pdfJS;
  } catch (error) {
    logError('Failed to initialize PDF.js library', { error });
    return null;
  }
};

/**
 * Create a blob URL for the worker to avoid CORS issues
 * This can be used as a last resort if other methods fail
 */
export const createWorkerBlobUrl = (workerUrl: string): string => {
  try {
    const blob = new Blob(
      [`importScripts('${workerUrl}');`],
      { type: 'application/javascript' }
    );
    return URL.createObjectURL(blob);
  } catch (error) {
    logError('Failed to create worker blob URL', { error });
    return workerUrl; // Fall back to the original URL
  }
};
