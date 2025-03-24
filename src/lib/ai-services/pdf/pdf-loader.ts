
import * as pdfjsLib from 'pdfjs-dist';
import { logInfo, logError } from '@/utils/logger';

// Set worker source using CDN to avoid bundling issues
// This is a more reliable CDN URL that should work consistently
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

/**
 * Load a PDF document from a file
 * @param file PDF file to load
 * @returns A promise that resolves to a PDFDocumentProxy
 */
export const loadPdfDocument = async (file: File): Promise<pdfjsLib.PDFDocumentProxy> => {
  try {
    // Convert the File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    logInfo("PDF processing: Starting to load document...");
    
    // Initialize PDF.js with complete options
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@5.0.375/cmaps/',
      cMapPacked: true
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
    
    logInfo(`PDF processing: Document loaded with ${pdfDocument.numPages} pages`);
    
    return pdfDocument;
  } catch (error) {
    logError('Error loading PDF document:', error);
    throw new Error(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
