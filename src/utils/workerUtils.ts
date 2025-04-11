
import { logInfo, logError } from './logger';

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
    
    // Set worker source using multiple fallbacks
    try {
      // Try different paths for worker (in order of preference)
      const workerPaths = [
        '/pdf.worker.min.js',
        '/assets/pdf.worker.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
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
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        logInfo('Using CDN fallback for PDF worker');
      }
    } catch (workerError) {
      logError('Error setting worker source', { error: workerError });
      
      // Last resort fallback
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
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
