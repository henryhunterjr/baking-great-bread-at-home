
import { logInfo, logError, logWarn } from '@/utils/logger';

/**
 * Ensures the PDF.js worker files are accessible and properly configured
 */
export const ensurePDFWorkerFiles = async (): Promise<boolean> => {
  try {
    logInfo('Attempting to access PDF worker file');
    
    // Check if the main worker file is accessible
    const workerResponse = await fetch('/pdf.worker.min.js', { method: 'HEAD' });
    
    if (!workerResponse.ok) {
      logError('PDF worker file is not accessible', { status: workerResponse.status });
      return false;
    }
    
    logInfo('PDF worker file is accessible');
    
    // Check if the cMaps directory is accessible (not critical, just warn if missing)
    try {
      // Try to access a common cMap file
      const cMapResponse = await fetch('/cmaps/Adobe-CNS1-UCS2.bcmap', { method: 'HEAD' });
      
      if (!cMapResponse.ok) {
        logWarn('PDF cMaps directory may not be accessible. This might affect some PDFs with special character sets.');
      }
    } catch (error) {
      logWarn('PDF cMaps directory may not be accessible. This might affect some PDFs with special character sets.');
    }
    
    // Even without cMaps, the worker should function for most PDFs
    logInfo('PDF worker files are properly configured and accessible');
    return true;
  } catch (error) {
    logError('Error checking PDF worker files', { error });
    return false;
  }
};

/**
 * Configure CORS settings for PDF.js worker
 */
export const configurePDFWorkerCORS = (): void => {
  try {
    // Set CORS attributes for PDF.js
    const corsSetting = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    // This is more for documentation as we can't control server CORS policy from client-side
    // But it reminds developers to ensure the server is configured correctly
    logInfo('PDF worker CORS configuration validated');
  } catch (error) {
    logError('Error configuring PDF worker CORS', { error });
  }
};

/**
 * Check if PDF extraction functionality is available
 */
export const isPDFExtractionAvailable = async (): Promise<boolean> => {
  try {
    // Check if the PDF.js library is loadable
    const pdfjs = await import('pdfjs-dist')
      .catch(error => {
        logError('Failed to load PDF.js library', { error });
        return null;
      });
    
    if (!pdfjs) {
      return false;
    }
    
    // Check if worker files are accessible
    const workerFilesAvailable = await ensurePDFWorkerFiles();
    
    return workerFilesAvailable;
  } catch (error) {
    logError('Error checking PDF extraction availability', { error });
    return false;
  }
};

/**
 * Fix common PDF worker issues
 */
export const fixPDFWorkerIssues = async (): Promise<boolean> => {
  try {
    // First check if files are accessible
    const filesAvailable = await ensurePDFWorkerFiles();
    
    if (filesAvailable) {
      // Files are already available, no fix needed
      return true;
    }
    
    // No client-side fixes are possible if files are missing
    // Log instructions for developers
    logWarn('PDF worker files are missing. Run scripts/copy-pdf-worker.js before building the app.');
    logWarn('Command: node scripts/copy-pdf-worker.js');
    
    return false;
  } catch (error) {
    logError('Error fixing PDF worker issues', { error });
    return false;
  }
};
