
/**
 * Worker Setup Utility
 * 
 * This utility handles setting up and configuring workers for PDF and OCR processing
 * without requiring direct package.json modifications.
 */

/**
 * Configure the PDF.js worker
 * This configures PDF.js to use a worker from a CDN if the local one isn't available
 */
export const configurePdfWorker = (): void => {
  try {
    // Try to use the local worker if available
    const pdfWorkerUrl = new URL('/pdf.worker.min.js', window.location.origin).href;
    
    // Check if worker exists by making a HEAD request
    fetch(pdfWorkerUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          // Set the worker location to the local file
          (window as any).pdfjsWorkerSrc = pdfWorkerUrl;
          console.log('[Worker Setup] Using local PDF.js worker');
        } else {
          // Fallback to CDN
          (window as any).pdfjsWorkerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.0.375/build/pdf.worker.min.js';
          console.log('[Worker Setup] Using CDN PDF.js worker');
        }
      })
      .catch(() => {
        // Network error, fall back to CDN
        (window as any).pdfjsWorkerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.0.375/build/pdf.worker.min.js';
        console.log('[Worker Setup] Fallback to CDN PDF.js worker after fetch error');
      });
  } catch (error) {
    console.error('[Worker Setup] Error configuring PDF worker:', error);
    // Final fallback
    (window as any).pdfjsWorkerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.0.375/build/pdf.worker.min.js';
  }
};

/**
 * Configure Tesseract OCR worker
 */
export const configureTesseractWorker = (): void => {
  try {
    // Since Tesseract.js manages its own worker loading, we just need to
    // set up any configuration options here if needed
    console.log('[Worker Setup] Tesseract worker configuration ready');
  } catch (error) {
    console.error('[Worker Setup] Error configuring Tesseract worker:', error);
  }
};

/**
 * Initialize all workers
 */
export const initializeWorkers = (): void => {
  console.log('[Worker Setup] Initializing workers...');
  configurePdfWorker();
  configureTesseractWorker();
};
