
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
    
    // Check if too many pages
    if (numPages > 50) {
      throw new Error(`PDF has ${numPages} pages. Maximum supported is 50. Please extract just the recipe portion.`);
    }
    
    // Extract text from each page individually
    let allText = '';
    
    // Process pages in small batches to avoid memory issues
    const BATCH_SIZE = 5;
    const batches = Math.ceil(numPages / BATCH_SIZE);
    
    for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
      const startPage = batchIndex * BATCH_SIZE + 1;
      const endPage = Math.min((batchIndex + 1) * BATCH_SIZE, numPages);
      
      logInfo(`Processing PDF batch ${batchIndex + 1}/${batches}`, { 
        startPage, 
        endPage,
        totalPages: numPages 
      });
      
      // Process this batch of pages using parallel promises
      const pagePromises = [];
      
      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
        pagePromises.push(extractPageText(pdf, pageNum));
      }
      
      // Wait for all pages in this batch to complete
      const batchTexts = await Promise.all(pagePromises);
      allText += batchTexts.join('\n\n');
      
      // Update progress
      if (onProgress) {
        const progress = 0.2 + 0.7 * ((batchIndex + 1) / batches);
        onProgress(progress);
      }
      
      // Small delay between batches to allow for garbage collection
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Final progress update
    if (onProgress) onProgress(0.95);
    
    // Clean the text
    const cleanedText = cleanOCRText(allText);
    
    // Complete
    if (onProgress) onProgress(1.0);
    
    return cleanedText;
  } catch (error) {
    logError("Error in chunked PDF processing", { error });
    throw error;
  }
};

/**
 * Helper function to extract text from a single page
 */
async function extractPageText(pdf: any, pageNum: number): Promise<string> {
  try {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    
    // Extract text from this page
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    
    // Clean up page to free memory
    page.cleanup();
    
    return pageText;
  } catch (error) {
    logError(`Error processing page ${pageNum}`, { error });
    return ''; // Return empty string for failed pages
  }
}
