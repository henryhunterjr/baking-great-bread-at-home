
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
    
    // Check if the cMaps directory is accessible - this is not critical
    // Missing cMaps only affects PDFs with special character sets
    try {
      // Try to access a common cMap file
      const cMapResponse = await fetch('/cmaps/Adobe-CNS1-UCS2.bcmap', { method: 'HEAD' });
      
      if (!cMapResponse.ok) {
        logWarn('PDF cMaps directory may not be accessible. This might affect some PDFs with special character sets.');
      } else {
        logInfo('PDF cMaps directory is accessible');
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
    
    // Log instructions for developers
    logWarn('PDF worker files are missing. Run scripts/copy-pdf-resources.js before building the app.');
    logWarn('Command: node scripts/copy-pdf-resources.js');
    
    return false;
  } catch (error) {
    logError('Error fixing PDF worker issues', { error });
    return false;
  }
};
