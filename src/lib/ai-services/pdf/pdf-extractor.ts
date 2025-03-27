
import { logInfo, logError } from '@/utils/logger';
import { ensurePDFWorkerFiles, configurePDFWorkerCORS } from './pdf-worker-service';
import { extractTextFromPDF } from './extraction/pdf-text-extractor';
import { CancellableTask, ExtractTextResult, ProgressCallback } from './types';

// Initialize the PDF worker service and CORS configuration on module load
Promise.all([
  ensurePDFWorkerFiles(),
  configurePDFWorkerCORS()
]).catch(error => 
  logError('Failed to initialize PDF worker service', { error })
);

/**
 * Extract text from a PDF file with enhanced reliability and error handling
 * This function is the main entry point for PDF text extraction
 * 
 * @param file PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns The extracted text from the PDF or a cancellable task
 */
export { extractTextFromPDF };

// Re-export the relevant types
export type { ExtractTextResult, CancellableTask, ProgressCallback } from './types';
