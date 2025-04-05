
import { logError, logInfo } from '@/utils/logger';
import { cleanOCRText } from '@/lib/ai-services/text-cleaner';

/**
 * Process large PDFs in smaller chunks to avoid memory issues
 */
export const processLargePDFInChunks = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Dynamically import PDF.js to reduce initial load time
    const pdfJS = await import('pdfjs-dist');
    
    // Set up worker
    const workerSrc = '/pdf.worker.min.js';
    pdfJS.GlobalWorkerOptions.workerSrc = workerSrc;
    
    // Report initial progress
    if (onProgress) onProgress(0.1);
    
    // Load the PDF
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
    
    // Get number of pages
    const numPages = pdf.numPages;
    logInfo("Processing large PDF in chunks", { numPages, filename: file.name });
    
    if (onProgress) onProgress(0.2);
    
    // Extract text from each page individually
    let allText = '';
    
    // Process pages in small batches to avoid memory issues
    const BATCH_SIZE = 5;
    const batches = Math.ceil(numPages / BATCH_SIZE);
    
    for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
      const startPage = batchIndex * BATCH_SIZE + 1;
      const endPage = Math.min((batchIndex + 1) * BATCH_SIZE, numPages);
      
      // Process this batch of pages
      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          
          // Extract text from this page
          const pageText = content.items
            .map((item: any) => item.str)
            .join(' ');
          
          allText += pageText + '\n\n';
          
          // Update progress
          if (onProgress) {
            const progress = 0.2 + 0.7 * (pageNum / numPages);
            onProgress(progress);
          }
          
          // Clean up page to free memory
          page.cleanup();
          
          // Force garbage collection between pages (not really possible in JS,
          // but we can null references to help)
          content.items = null;
        } catch (pageError) {
          logError(`Error processing page ${pageNum}`, { error: pageError });
          // Continue with other pages even if one fails
        }
      }
      
      // Small delay between batches to allow for garbage collection
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Final progress update
    if (onProgress) onProgress(0.95);
    
    // Clean the text
    const cleanedText = cleanOCRText(allText);
    
    // Complete
    if (onProgress) onProgress(0.99);
    
    return cleanedText;
  } catch (error) {
    logError("Error in chunked PDF processing", { error });
    throw error;
  }
};
