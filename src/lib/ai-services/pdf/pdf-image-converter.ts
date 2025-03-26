
import * as pdfjsLib from 'pdfjs-dist';
import { logInfo, logError } from '@/utils/logger';
import { loadPdfDocument } from './pdf-loader';

/**
 * Convert the first page of a PDF file to an image
 * @param file PDF file to convert
 * @param timeout Optional timeout in milliseconds (default: 20000)
 * @returns A promise that resolves to a data URL of the image
 */
export const convertPDFPageToImage = async (
  file: File, 
  timeout = 20000 // Increased from 8000ms
): Promise<string> => {
  let pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;
  
  try {
    logInfo('Converting PDF to image', { fileName: file.name, fileSize: file.size });
    
    // Set a timeout for the conversion
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('PDF loading timed out after ' + timeout/1000 + ' seconds')), timeout);
    });
    
    // Load the PDF document
    const documentPromise = loadPdfDocument(file);
    
    // Race between loading and timeout
    pdfDocument = await Promise.race([documentPromise, timeoutPromise]);
    
    // Get the first page
    const page = await pdfDocument.getPage(1);
    
    // Calculate viewport dimensions for optimal resolution
    const viewport = page.getViewport({ scale: 1.5 });
    
    // Create a canvas to render the page
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }
    
    // Render the PDF page to the canvas
    await page.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise;
    
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    // Clean up
    if (pdfDocument) {
      try {
        pdfDocument.destroy();
      } catch (e) {
        logError('Error destroying PDF document', { error: e });
      }
    }
    
    return dataUrl;
  } catch (error) {
    logError('Error converting PDF to image', { error });
    
    // Clean up
    if (pdfDocument) {
      try {
        pdfDocument.destroy();
      } catch (e) {
        logError('Error destroying PDF document during error handling', { error: e });
      }
    }
    
    throw error;
  }
};
