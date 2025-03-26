
import * as pdfjsLib from 'pdfjs-dist';
import { logInfo, logError } from '@/utils/logger';

// Configure PDF.js to use a locally hosted worker file
// This resolves CORS issues and network reliability problems
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

/**
 * Load a PDF document from a file
 * @param file PDF file to load
 * @returns A promise that resolves to a PDFDocumentProxy
 */
export const loadPdfDocument = async (file: File): Promise<pdfjsLib.PDFDocumentProxy> => {
  try {
    // Convert the File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    logInfo("PDF processing: Starting to load document");
    
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
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('PDF loading timed out after 30 seconds')), 30000)
    );
    
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
