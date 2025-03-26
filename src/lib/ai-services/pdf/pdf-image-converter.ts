
import * as pdfjsLib from 'pdfjs-dist';
import { logError, logInfo } from '@/utils/logger';

// Use the same worker configuration as pdf-loader.ts
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

/**
 * Convert the first page of a PDF to an image using canvas
 * @param file PDF file to convert
 * @param timeout Timeout in milliseconds (default: 15000ms / 15 seconds)
 * @returns A Data URL string with the image content
 */
export const convertPDFPageToImage = async (
  file: File,
  timeout = 15000
): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: '/cmaps/',
      cMapPacked: true,
      disableRange: true,
      disableStream: true
    });
    
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        loadingTask.destroy().catch(e => {
          logError('Error destroying PDF loading task during timeout', { error: e });
        });
        reject(new Error(`PDF loading timed out after ${timeout/1000} seconds`));
      }, timeout);
      
      return () => clearTimeout(timeoutId);
    });
    
    // Race between loading and timeout
    const pdf = await Promise.race([
      loadingTask.promise,
      timeoutPromise
    ]) as pdfjsLib.PDFDocumentProxy;
    
    // Get the first page only
    const page = await pdf.getPage(1);
    
    // Create a canvas to render the PDF page
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Canvas context could not be created');
    }
    
    // Set the dimensions with a reasonable scale for OCR
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    logInfo("Rendering PDF page to canvas", {
      width: canvas.width,
      height: canvas.height
    });
    
    // Render the PDF page to the canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Clean up PDF resources
    try {
      pdf.destroy();
    } catch (e) {
      logError('Error destroying PDF document', { error: e });
    }
    
    // Convert canvas to image data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    logError('Error converting PDF to image', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
