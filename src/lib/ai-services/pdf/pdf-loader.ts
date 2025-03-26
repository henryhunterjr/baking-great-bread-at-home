
import * as pdfjsLib from 'pdfjs-dist';
import { logInfo, logError } from '@/utils/logger';

// Configure PDF.js to use a locally hosted worker file
// This resolves CORS issues and network reliability problems
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// Default timeout for PDF loading in milliseconds
const DEFAULT_TIMEOUT = 20000; // 20 seconds

/**
 * Load a PDF document from a file
 * @param file PDF file to load
 * @param timeout Optional timeout in milliseconds (default: 20000ms)
 * @returns A promise that resolves to a PDFDocumentProxy
 */
export const loadPdfDocument = async (
  file: File, 
  timeout = DEFAULT_TIMEOUT
): Promise<pdfjsLib.PDFDocumentProxy> => {
  try {
    // Convert the File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    logInfo("PDF processing: Starting to load document", { 
      fileName: file.name,
      fileSize: file.size,
      timeout
    });
    
    // Initialize PDF.js with proper options for better compatibility
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: '/cmaps/',
      cMapPacked: true,
      // Disable range requests which can cause issues in some environments
      disableRange: true,
      // Disable streaming to improve compatibility
      disableStream: true
    });
    
    // Set a timeout for PDF loading to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        loadingTask.destroy().catch(e => {
          logError('Error destroying PDF loading task during timeout', { error: e });
        });
        reject(new Error(`PDF loading timed out after ${timeout/1000} seconds`));
      }, timeout);
      
      // Make the timeout ID available for potential cancellation
      return () => clearTimeout(timeoutId);
    });
    
    // Race between loading and timeout
    const pdfDocument = await Promise.race([
      loadingTask.promise,
      timeoutPromise
    ]) as pdfjsLib.PDFDocumentProxy;
    
    logInfo("PDF processing: Document loaded successfully", { 
      pageCount: pdfDocument.numPages 
    });
    
    return pdfDocument;
  } catch (error) {
    logError('Error loading PDF document', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
