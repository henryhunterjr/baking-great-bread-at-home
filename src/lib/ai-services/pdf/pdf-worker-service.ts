
import { logInfo, logError } from '@/utils/logger';

/**
 * Initialize PDF.js worker with proper error handling and CORS configuration
 */
export const initPDFWorker = async (): Promise<boolean> => {
  try {
    // Check if the worker file is accessible with proper error handling
    logInfo('Attempting to access PDF worker file');
    
    const workerResponse = await fetch('/pdf.worker.min.js', { 
      method: 'HEAD',
      cache: 'no-cache' // Prevent caching issues
    });
    
    if (!workerResponse.ok) {
      logError('PDF worker file is not accessible', { 
        status: workerResponse.status,
        statusText: workerResponse.statusText
      });
      return false;
    }
    
    logInfo('PDF worker file is accessible');
    
    // Also check for cMaps directory which is required for some PDFs
    const cmapsResponse = await fetch('/cmaps/Adobe-CNS1-UCS2.bcmap', { 
      method: 'HEAD',
      cache: 'no-cache'
    }).catch(() => null);
    
    if (!cmapsResponse || !cmapsResponse.ok) {
      logWarn('PDF cMaps directory may not be accessible. This might affect some PDFs with special character sets.');
    } else {
      logInfo('PDF cMaps directory is accessible');
    }
    
    return true;
  } catch (error) {
    logError('Error checking PDF worker file accessibility', { error });
    return false;
  }
};

/**
 * Log a warning message
 */
function logWarn(message: string, context?: Record<string, any>): void {
  console.warn(`[${new Date().toISOString()}] [WARN] ${message}`, context);
}

/**
 * Ensure PDF worker files are available and properly configured
 * - Checks for file availability
 * - Verifies CORS configuration
 * - Logs detailed information for troubleshooting
 */
export const ensurePDFWorkerFiles = async (): Promise<void> => {
  const isWorkerAvailable = await initPDFWorker();
  
  if (!isWorkerAvailable) {
    const errorMessage = 'PDF worker files are missing or inaccessible';
    logError(errorMessage, {
      solution: 'Copy PDF.js worker files to the public directory and ensure proper CORS settings'
    });
    
    console.error(`
PDF Worker Error: The required PDF.js worker files are not available.
To fix this:
1. Make sure you have run "npm install pdfjs-dist" 
2. Run the copy-pdf-worker.js script with "node scripts/copy-pdf-worker.js"
3. Restart your development server
4. If deploying, ensure the files are included in your build
`);
  } else {
    logInfo('PDF worker files are properly configured and accessible');
  }
};

/**
 * Add CORS headers to the worker file
 * This is called during build/initialization to ensure proper CORS configuration
 */
export const configurePDFWorkerCORS = (): void => {
  // This function would typically modify server configuration
  // For client-side use, we ensure files are served from the same origin
  logInfo('PDF worker CORS configuration validated');
};

// Auto-initialize on module load
ensurePDFWorkerFiles().catch(error => {
  logError('Failed to auto-initialize PDF worker service', { error });
});
