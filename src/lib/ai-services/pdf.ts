
import { logInfo, logError } from '@/utils/logger';
import { cleanOCRText } from './text-cleaner';

/**
 * Extract text from a PDF file
 */
export const extractTextFromPDF = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string | { cancel: () => void }> => {
  try {
    logInfo(`Starting PDF extraction for: ${file.name} (${file.size} bytes)`);
    
    // Dynamically import PDF.js to reduce initial load time
    const pdfJS = await import('pdfjs-dist');
    
    // Set up worker
    const workerSrc = '/pdf.worker.min.js';
    pdfJS.GlobalWorkerOptions.workerSrc = workerSrc;
    
    // Report initial progress
    if (onProgress) onProgress(0.1);
    
    // Create a cancellation token
    let isCancelled = false;
    const cancelToken = {
      cancel: () => {
        isCancelled = true;
        logInfo("PDF processing cancelled");
      }
    };
    
    // Load document
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
    
    // Check page count
    const numPages = pdf.numPages;
    logInfo(`PDF loaded with ${numPages} pages`);
    
    if (numPages > 50) {
      throw new Error(`PDF has ${numPages} pages. Maximum supported is 50. Please extract just the recipe portion.`);
    }
    
    // If pages > 10, we use the chunking method
    if (numPages > 10) {
      return await processInChunks(pdf, numPages, onProgress, isCancelled);
    }
    
    // For smaller documents, process all pages at once
    if (onProgress) onProgress(0.2);
    
    let fullText = '';
    
    // Process each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (isCancelled) {
        return cancelToken;
      }
      
      try {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        
        // Extract text from this page
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n\n';
        
        // Update progress
        if (onProgress) {
          const progress = 0.2 + 0.7 * (pageNum / numPages);
          onProgress(progress);
        }
      } catch (pageError) {
        logError(`Error processing page ${pageNum}`, { error: pageError });
        // Continue with other pages even if one fails
      }
    }
    
    // Clean the text
    if (onProgress) onProgress(0.95);
    const cleanedText = cleanOCRText(fullText);
    
    // Complete
    if (onProgress) onProgress(1.0);
    
    return cleanedText;
  } catch (error) {
    logError('PDF extraction error', { error });
    throw error;
  }
};

/**
 * Process PDF in chunks to avoid memory issues with large documents
 */
async function processInChunks(
  pdf: any,
  numPages: number,
  onProgress?: (progress: number) => void,
  isCancelled?: boolean
): Promise<string> {
  const CHUNK_SIZE = 5; // Process 5 pages at a time
  let fullText = '';
  const chunks = Math.ceil(numPages / CHUNK_SIZE);
  
  for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
    if (isCancelled) {
      throw new Error("PDF processing cancelled");
    }
    
    const startPage = chunkIndex * CHUNK_SIZE + 1;
    const endPage = Math.min((chunkIndex + 1) * CHUNK_SIZE, numPages);
    
    logInfo(`Processing PDF chunk ${chunkIndex + 1}/${chunks} (pages ${startPage}-${endPage})`);
    
    const pagePromises = [];
    
    // Create promises for each page in this chunk
    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      pagePromises.push(extractPageText(pdf, pageNum));
    }
    
    // Process this chunk
    const pageTexts = await Promise.all(pagePromises);
    fullText += pageTexts.join('\n\n');
    
    // Update progress
    if (onProgress) {
      const progress = 0.2 + 0.7 * ((chunkIndex + 1) / chunks);
      onProgress(progress);
    }
    
    // Small delay between chunks to allow for garbage collection
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Clean the text
  if (onProgress) onProgress(0.95);
  const cleanedText = cleanOCRText(fullText);
  
  // Complete
  if (onProgress) onProgress(1.0);
  return cleanedText;
}

/**
 * Extract text from a single PDF page
 */
async function extractPageText(pdf: any, pageNum: number): Promise<string> {
  try {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Convert text items to strings
    return textContent.items
      .map((item: any) => item.str)
      .join(' ');
  } catch (error) {
    logError(`Error extracting text from page ${pageNum}`, { error });
    return ''; // Return empty string for failed pages
  }
}
