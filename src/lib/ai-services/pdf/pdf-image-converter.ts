
import * as pdfjsLib from 'pdfjs-dist';
import { logError, logInfo } from '@/utils/logger';

// Use the same worker configuration as pdf-loader.ts
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

/**
 * Convert the first page of a PDF to an image using canvas
 * @returns A Data URL string with the image content
 */
export const convertPDFPageToImage = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: '/cmaps/',
      cMapPacked: true
    });
    
    // Set a timeout to prevent hanging
    const pdfPromise = Promise.race([
      loadingTask.promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PDF loading timed out')), 20000)
      )
    ]);
    
    const pdf = await pdfPromise as pdfjsLib.PDFDocumentProxy;
    const page = await pdf.getPage(1);
    
    // Create a canvas to render the PDF page
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Canvas context could not be created');
    }
    
    // Set the dimensions
    const viewport = page.getViewport({ scale: 1.5 }); // Scale up for better OCR results
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
