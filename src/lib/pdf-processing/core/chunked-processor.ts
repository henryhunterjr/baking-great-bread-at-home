import { logError, logInfo } from '@/utils/logger';
import { PDF_WORKER_CONFIG } from '@/config/pdf-worker-config';

/**
 * Process a large PDF in chunks to avoid memory issues
 * @param file PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns Extracted text from the PDF
 */
export const processLargePDFInChunks = async (
  file: File,
  progressCallback?: (progress: number) => void
): Promise<string> => {
  try {
    logInfo('Processing large PDF in chunks', { fileName: file.name, fileSize: file.size });
    
    // Dynamically import PDF.js to reduce initial bundle size
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source if not already set
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_CONFIG.workerSrc;
    }
    
    // Report initial progress
    if (progressCallback) progressCallback(0.05);
    
    // Read the file
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the document with explicit cMap options
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: PDF_WORKER_CONFIG.cmapsUrl,
      cMapPacked: PDF_WORKER_CONFIG.cmapsPacked,
      disableAutoFetch: false
    }).promise;
    
    // Get total pages
    const numPages = pdf.numPages;
    logInfo(`PDF loaded with ${numPages} pages`);
    
    // Define chunk processing parameters - now smaller to avoid memory issues
    const CHUNK_SIZE = 3; // Process 3 pages at a time (reduced from 5)
    const numChunks = Math.ceil(numPages / CHUNK_SIZE);
    
    // To store all extracted text
    let fullText = '';
    
    // Process each chunk
    for (let chunkIndex = 0; chunkIndex < numChunks; chunkIndex++) {
      const startPage = chunkIndex * CHUNK_SIZE + 1;
      const endPage = Math.min((chunkIndex + 1) * CHUNK_SIZE, numPages);
      
      logInfo(`Processing chunk ${chunkIndex + 1}/${numChunks} (pages ${startPage}-${endPage})`);
      
      // Create promises for each page in the chunk
      const pagePromises = [];
      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
        pagePromises.push(extractPageText(pdf, pageNum));
      }
      
      // Process all pages in this chunk in parallel
      const pageTexts = await Promise.all(pagePromises);
      
      // Combine text from all pages in this chunk
      fullText += pageTexts.join('\n\n');
      
      // Report progress
      if (progressCallback) {
        const progress = 0.1 + 0.85 * ((chunkIndex + 1) / numChunks);
        progressCallback(progress);
      }
      
      // Add a slightly larger delay between chunks to allow for garbage collection
      if (chunkIndex < numChunks - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Force garbage collection if available (only in certain environments)
      if (typeof window !== 'undefined' && (window as any).gc) {
        try {
          (window as any).gc();
        } catch (e) {
          // Ignore if not available
        }
      }
    }
    
    // Report completion
    if (progressCallback) progressCallback(0.95);
    
    return fullText.trim();
  } catch (error) {
    logError('Error processing PDF in chunks', { error });
    throw error;
  }
};

/**
 * Extract text from a single PDF page
 * @param pdf PDF document
 * @param pageNum Page number
 * @returns Text content of the page
 */
async function extractPageText(pdf: any, pageNum: number): Promise<string> {
  try {
    // Get the page
    const page = await pdf.getPage(pageNum);
    
    // Get text content
    const textContent = await page.getTextContent();
    
    // Extract text strings
    const text = textContent.items
      .map((item: any) => item.str || '')
      .join(' ');
    
    // Clean up page object to help garbage collection
    // @ts-ignore - This isn't in the public API but helps with memory
    if (page.cleanup && typeof page.cleanup === 'function') {
      page.cleanup();
    }
    
    return text;
  } catch (error) {
    logError(`Failed to extract text from page ${pageNum}`, { error });
    return `[Error extracting text from page ${pageNum}]`;
  }
}
