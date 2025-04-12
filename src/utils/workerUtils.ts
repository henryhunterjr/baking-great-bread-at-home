
import { logInfo, logError } from './logger';
import { PDF_WORKER_CONFIG } from '@/config/pdf-worker-config';

/**
 * Initialize PDF.js library with proper worker configuration
 * This handles all the common worker loading issues
 */
export const initializePdfLib = async (): Promise<any> => {
  try {
    logInfo('Initializing PDF.js library');
    
    // First try to import the library
    const pdfjs = await import('pdfjs-dist')
      .catch(error => {
        logError('Failed to import PDF.js library', { error });
        return null;
      });
    
    if (!pdfjs) {
      logError('PDF.js import failed');
      return null;
    }
    
    // Set worker source using config
    try {
      // Try different paths for worker (in order of preference)
      const workerPaths = [
        PDF_WORKER_CONFIG.workerSrc,
        '/assets/pdf.worker.min.js',
        PDF_WORKER_CONFIG.fallbackWorkerSrc
      ];
      
      // Function to check if worker is available at path
      const checkWorkerPath = async (path: string): Promise<boolean> => {
        try {
          const response = await fetch(path, { method: 'HEAD' });
          return response.ok;
        } catch (e) {
          return false;
        }
      };
      
      // Try each path in sequence
      for (const workerPath of workerPaths) {
        const isAvailable = await checkWorkerPath(workerPath);
        
        if (isAvailable) {
          pdfjs.GlobalWorkerOptions.workerSrc = workerPath;
          logInfo(`Successfully loaded PDF worker from: ${workerPath}`);
          break;
        }
      }
      
      // If we couldn't find a worker, use CDN as last resort
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_CONFIG.fallbackWorkerSrc;
        logInfo('Using CDN fallback for PDF worker');
      }
    } catch (workerError) {
      logError('Error setting worker source', { error: workerError });
      
      // Last resort fallback
      pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_CONFIG.fallbackWorkerSrc;
      logInfo('Using CDN emergency fallback for PDF worker');
    }
    
    return pdfjs;
  } catch (error) {
    logError('Failed to initialize PDF library', { error });
    return null;
  }
};

/**
 * Safely initialize Firebase
 * This handles common Firebase initialization issues
 */
export const safelyInitializeFirebase = async (): Promise<any> => {
  try {
    logInfo('Safely initializing Firebase');
    
    // Try to import Firebase
    const firebase = await import('firebase/app')
      .catch(error => {
        logError('Failed to import Firebase', { error });
        return null;
      });
      
    if (!firebase) {
      logError('Firebase import failed');
      return null;
    }
    
    // Check if we're already initialized
    try {
      return firebase.getApp();
    } catch (getAppError) {
      // App doesn't exist yet, continue with initialization
    }
    
    // Fallback minimal config - will be replaced with proper config when available
    const fallbackConfig = {
      apiKey: "fallback-api-key",
      authDomain: "fallback-app.firebaseapp.com",
      projectId: "fallback-app",
    };
    
    // Try to initialize with fallback config
    try {
      const app = firebase.initializeApp(fallbackConfig);
      logInfo('Firebase initialized with fallback config');
      return app;
    } catch (initError: any) {
      // Check if the error is because Firebase is already initialized
      if (initError.code === 'app/duplicate-app') {
        // App already exists, return the existing app
        const app = firebase.getApp();
        logInfo('Using existing Firebase app');
        return app;
      }
      
      logError('Failed to initialize Firebase, even with fallback', { error: initError });
      return null;
    }
  } catch (error) {
    logError('Unexpected error initializing Firebase', { error });
    return null;
  }
};

/**
 * Initialize workers for PDF.js and other services
 * This should be called early in the application lifecycle
 */
export const initializeWorkers = (): void => {
  try {
    // Set up PDF.js worker
    setupPDFWorker();
    
    logInfo('Workers initialized successfully');
  } catch (error) {
    logError('Error initializing workers', { error });
  }
};

/**
 * Preload workers to improve initial performance
 */
export const preloadWorkers = async (): Promise<void> => {
  try {
    // Preload PDF.js
    const pdfjs = await initializePdfLib();
    if (pdfjs) {
      logInfo('PDF.js library preloaded successfully');
    }
  } catch (error) {
    logError('Error preloading workers', { error });
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
      (window as any).pdfjsWorkerSrc = PDF_WORKER_CONFIG.workerSrc;
      
      // Add a fallback to CDN in case local worker fails
      window.addEventListener('error', (event) => {
        // Check if error is related to PDF.js worker
        if (event.filename?.includes('pdf.worker.min.js')) {
          logInfo('PDF worker load failed, using CDN fallback');
          (window as any).pdfjsWorkerSrc = PDF_WORKER_CONFIG.fallbackWorkerSrc;
        }
      }, { once: true });
    }
  } catch (error) {
    logError('Error setting up PDF worker', { error });
  }
};
