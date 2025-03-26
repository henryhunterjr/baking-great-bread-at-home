
import { logInfo, logError } from '@/utils/logger';

/**
 * Initialize PDF.js worker with proper error handling
 */
export const initPDFWorker = async (): Promise<boolean> => {
  try {
    // Check if the worker file is accessible
    const workerResponse = await fetch('/pdf.worker.min.js', { method: 'HEAD' });
    
    if (!workerResponse.ok) {
      logError('PDF worker file is not accessible', { 
        status: workerResponse.status,
        statusText: workerResponse.statusText
      });
      return false;
    }
    
    logInfo('PDF worker file is accessible');
    
    // Also check for cMaps directory which is required for some PDFs
    const cmapsResponse = await fetch('/cmaps/Adobe-CNS1-UCS2.bcmap', { method: 'HEAD' }).catch(() => null);
    
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
 * Run a script to copy the PDF worker file to the public directory
 */
export const ensurePDFWorkerFiles = async (): Promise<void> => {
  // In a real app, this would copy files, but in this case we just log the check
  const isWorkerAvailable = await initPDFWorker();
  
  if (!isWorkerAvailable) {
    logError('PDF worker files are missing. Please run the copy-pdf-worker.js script before building the app.');
    console.error(`
PDF Worker Error: The required PDF.js worker files are not available.
To fix this:
1. Make sure you have run "npm install pdfjs-dist" 
2. Run the copy-pdf-worker.js script with "node scripts/copy-pdf-worker.js"
3. Restart your development server
`);
  }
};
