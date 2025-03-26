
import * as pdfjsLib from 'pdfjs-dist';
import { logInfo, logError } from '@/utils/logger';

// Configure PDF.js to use a locally hosted worker file
// This resolves CORS issues and network reliability problems
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// Default timeout for PDF loading in milliseconds
const DEFAULT_TIMEOUT = 30000; // 30 seconds - increased from 15 seconds

/**
 * Load a PDF document from a file
 * @param file PDF file to load
 * @param timeout Optional timeout in milliseconds (default: 30000ms)
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
      disableStream: true,
      // Add worker parameters to improve performance
      verbosity: 0,
      isEvalSupported: false
    });
    
    // Set a timeout for PDF loading to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        loadingTask.destroy().catch(e => {
          logError('Error destroying PDF loading task during timeout', { error: e });
        });
        reject(new Error(`PDF loading timed out after ${timeout/1000} seconds. Please try another file or check your connection.`));
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
    
    // Improved error messaging with specific recommendations
    if (error instanceof Error) {
      if (error.message.includes('timed out')) {
        throw new Error(`Failed to load PDF: ${error.message}. Please try with a smaller file or use image upload instead.`);
      } else if (error.message.includes('worker') || error.message.includes('fetch')) {
        throw new Error(`Failed to load PDF: Network or worker issue. Please check your connection and try again.`);
      } else if (error.message.includes('password')) {
        throw new Error(`Failed to load PDF: This document appears to be password protected. Please provide an unprotected PDF.`);
      }
    }
    
    throw new Error(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try another file format.`);
  }
};
