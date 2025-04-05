
import { logError, logInfo } from '@/utils/logger';
import { processPDF } from '@/lib/pdf-processing/pdf-extractor';
import { ProcessingCallbacks, ProcessingTask } from './types';

/**
 * Process a PDF file and extract its text content
 */
export const processPDFFile = async (
  file: File,
  callbacks: ProcessingCallbacks
): Promise<ProcessingTask> => {
  const { onProgress, onComplete, onError } = callbacks;
  
  try {
    logInfo('Processing PDF file', { filename: file.name, filesize: file.size });
    
    // Check if file too large (> 20MB)
    if (file.size > 20 * 1024 * 1024) {
      onError('PDF file is too large (max 20MB). Please try a smaller file or extract just the recipe section.');
      return null;
    }
    
    // Start processing - this returns a cancellable task
    return processPDF(
      file,
      (text) => {
        onProgress(100); // Complete
        onComplete(text);
      },
      (errorMessage) => {
        onError(errorMessage);
      }
    );
  } catch (err) {
    logError('PDF processing error:', { error: err });
    onError(err instanceof Error ? err.message : 'Failed to process PDF file.');
    return null;
  }
};
