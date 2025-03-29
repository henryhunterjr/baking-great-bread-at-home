
import { logError, logInfo } from '@/utils/logger';

/**
 * Extract text from a PDF file
 * @param file - The PDF file to extract text from
 * @param onProgress - Callback to report progress (0-1)
 * @returns Promise with the extracted text
 */
export const extractTextFromPDF = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    logInfo('PDF extraction started', { filename: file.name, size: file.size });
    
    // Report initial progress
    if (onProgress) onProgress(0.1);
    
    // Dynamically import PDF.js to avoid issues with SSR
    const pdfJS = await import('pdfjs-dist');
    
    // Use the globally configured worker source from our worker setup utility
    const workerSrc = (window as any).pdfjsWorkerSrc || 
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.0.375/build/pdf.worker.min.js';
    
    pdfJS.GlobalWorkerOptions.workerSrc = workerSrc;
    
    // Report progress after library loaded
    if (onProgress) onProgress(0.2);
    
    // Load the PDF file
    const fileArrayBuffer = await file.arrayBuffer();
    const pdf = await pdfJS.getDocument({ data: fileArrayBuffer }).promise;
    
    // Report progress after PDF loaded
    if (onProgress) onProgress(0.3);
    
    // Get the number of pages
    const numPages = pdf.numPages;
    logInfo('PDF loaded successfully', { numPages });
    
    // Extract text from each page
    let extractedText = '';
    for (let i = 1; i <= numPages; i++) {
      // Calculate progress for this page
      const pageProgress = 0.3 + (0.6 * (i - 1) / numPages);
      if (onProgress) onProgress(pageProgress);
      
      // Get the page
      const page = await pdf.getPage(i);
      
      // Extract the text content
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      extractedText += pageText + '\n\n';
      
      // Report progress after page processed
      const pageCompleteProgress = 0.3 + (0.6 * i / numPages);
      if (onProgress) onProgress(pageCompleteProgress);
    }
    
    // Final progress
    if (onProgress) onProgress(1.0);
    
    logInfo('PDF extraction completed', { 
      extractedTextLength: extractedText.length 
    });
    
    return extractedText;
  } catch (error) {
    logError('PDF extraction error', { error });
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
};
