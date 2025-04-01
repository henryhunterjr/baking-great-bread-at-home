
import { logInfo, logError } from './logger';

/**
 * Configure PDF.js and Tesseract.js workers with fallbacks
 * This is crucial for production environments where worker paths may differ
 */
export const configureWorkers = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    configurePDFWorker();
    configureTesseractWorker();
    logInfo('Workers configured successfully');
  } catch (error) {
    logError('Error configuring workers:', { error });
  }
};

/**
 * Configure PDF.js worker with multiple fallbacks
 */
const configurePDFWorker = (): void => {
  // Try to dynamically import pdfjs-dist to set the worker path
  const tryImportPDFJS = async () => {
    try {
      const pdfjs = await import('pdfjs-dist');
      
      // Array of possible worker paths to try, in order of preference
      const workerPaths = [
        '/pdf.worker.min.js',  // Local path in public directory
        '/assets/pdf.worker.min.js',  // Alternative local path
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js',  // CDN fallback 1
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',  // CDN fallback 2
      ];
      
      // Set the worker source URL
      setWorkerUrl(pdfjs, workerPaths);
      
      // Also set the global variable that some PDF.js imports look for
      (window as any).pdfjsWorkerSrc = pdfjs.GlobalWorkerOptions.workerSrc;
      
      logInfo('PDF.js worker configured', { path: pdfjs.GlobalWorkerOptions.workerSrc });
    } catch (error) {
      logError('Error importing PDF.js:', { error });
    }
  };

  // Test worker paths and set the first one that works
  const setWorkerUrl = async (pdfjs: any, paths: string[]) => {
    for (const path of paths) {
      try {
        // Try fetching the worker file to see if it exists
        const response = await fetch(path, { method: 'HEAD' });
        if (response.ok) {
          pdfjs.GlobalWorkerOptions.workerSrc = path;
          logInfo('PDF.js worker path set successfully', { path });
          return;
        }
      } catch (e) {
        logError('Error checking worker path:', { path, error: e });
      }
    }
    
    // If no paths worked, try the last one anyway
    pdfjs.GlobalWorkerOptions.workerSrc = paths[paths.length - 1];
    logInfo('PDF.js worker path set to fallback', { path: paths[paths.length - 1] });
  };
  
  // Try configuring the worker
  tryImportPDFJS();
};

/**
 * Configure Tesseract.js worker with fallbacks
 */
const configureTesseractWorker = (): void => {
  try {
    // Set global Tesseract variables that the library looks for
    (window as any).Tesseract = (window as any).Tesseract || {};
    
    // Define fallback paths for Tesseract worker and core files
    const workerPath = '/tesseract/worker.min.js';
    const corePath = '/tesseract/tesseract-core.wasm.js';
    const langPath = '/tesseract/lang-data/';
    
    // CDN fallbacks
    const workerCDN = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.0/dist/worker.min.js';
    const coreCDN = 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.0.0/tesseract-core.wasm.js';
    
    // Try local paths first, then fall back to CDN
    const checkAndSetPath = async (localPath: string, cdnPath: string, pathName: string) => {
      try {
        const response = await fetch(localPath, { method: 'HEAD' });
        if (response.ok) {
          return localPath;
        }
        return cdnPath;
      } catch (e) {
        logError(`Error checking Tesseract ${pathName} path:`, { error: e });
        return cdnPath;
      }
    };
    
    // Set up paths asynchronously
    const configurePaths = async () => {
      (window as any).tesseractWorkerSrc = await checkAndSetPath(workerPath, workerCDN, 'worker');
      (window as any).tesseractCorePath = await checkAndSetPath(corePath, coreCDN, 'core');
      (window as any).Tesseract.workerPath = (window as any).tesseractWorkerSrc;
      (window as any).Tesseract.corePath = (window as any).tesseractCorePath;
      (window as any).Tesseract.langPath = langPath;
      
      logInfo('Tesseract worker configured', { 
        worker: (window as any).tesseractWorkerSrc,
        core: (window as any).tesseractCorePath 
      });
    };
    
    configurePaths();
  } catch (error) {
    logError('Error configuring Tesseract worker:', { error });
  }
};

/**
 * Initialize all workers on page load
 * This should be called from your application root component
 */
export const initializeWorkers = (): void => {
  if (typeof window !== 'undefined') {
    // Configure immediately
    configureWorkers();
    
    // Also configure when the window loads (for better browser compatibility)
    window.addEventListener('load', () => {
      configureWorkers();
    });
  }
};
