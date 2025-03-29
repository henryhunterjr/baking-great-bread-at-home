
import { logError, logInfo } from '@/utils/logger';

/**
 * Converts a PDF page to an image for OCR processing
 * @param file PDF file
 * @param timeout Timeout in milliseconds (default: 10000ms)
 * @param pageNumber Page number to convert (default: 1, first page)
 * @returns Promise with data URL of the rendered page
 */
export const convertPDFPageToImage = async (
  file: File,
  timeout: number = 10000,
  pageNumber: number = 1
): Promise<string> => {
  try {
    logInfo('Starting PDF to image conversion', { 
      filename: file.name, 
      size: file.size,
      page: pageNumber 
    });
    
    // Set up a timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`PDF to image conversion timed out after ${timeout}ms`));
      }, timeout);
    });
    
    // Create the actual conversion promise
    const conversionPromise = async (): Promise<string> => {
      // Load PDF.js
      const pdfJS = await import('pdfjs-dist');
      
      // Use the worker source from our global configuration
      const workerSrc = (window as any).pdfjsWorkerSrc || 
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.0.375/build/pdf.worker.min.js';
      
      pdfJS.GlobalWorkerOptions.workerSrc = workerSrc;
      
      // Load the PDF file
      const fileArrayBuffer = await file.arrayBuffer();
      const pdf = await pdfJS.getDocument({ data: fileArrayBuffer }).promise;
      
      // Make sure the requested page exists
      const actualPageNumber = Math.min(pageNumber, pdf.numPages);
      
      // Get the page
      const page = await pdf.getPage(actualPageNumber);
      
      // Calculate a good scale for OCR (higher resolution for better OCR results)
      const viewport = page.getViewport({ scale: 2.0 });
      
      // Prepare canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not create canvas context');
      }
      
      // Set canvas dimensions to match the viewport
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render the PDF page to the canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Get data URL from canvas (JPEG format with good quality for OCR)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      logInfo('PDF to image conversion complete', { 
        page: actualPageNumber,
        width: canvas.width,
        height: canvas.height
      });
      
      return dataUrl;
    };
    
    // Race the conversion against the timeout
    return await Promise.race([
      conversionPromise(),
      timeoutPromise
    ]);
  } catch (error) {
    logError('PDF to image conversion failed', { error });
    throw new Error(`Failed to convert PDF to image: ${error instanceof Error ? error.message : String(error)}`);
  }
};
