
import * as pdfjsLib from 'pdfjs-dist';
import { logError, logInfo } from '@/utils/logger';

// Configure PDF.js to use a proper worker path - this is critical for browser environments
// Use CDN version to avoid bundling issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Convert the first page of a PDF to an image using canvas
 */
export const convertPDFPageToImage = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@5.0.375/cmaps/',
      cMapPacked: true
    });
    
    const pdf = await loadingTask.promise;
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
    
    logInfo(`Rendering PDF page to canvas (${canvas.width}x${canvas.height})`);
    
    // Render the PDF page to the canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Convert canvas to image data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    logError('Error converting PDF to image:', error);
    throw error;
  }
};
