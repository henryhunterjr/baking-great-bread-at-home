
import { logInfo, logError } from '@/utils/logger';
import { cleanOCRText } from './text-cleaner';
import { initializePdfLib } from '@/utils/workerUtils';

/**
 * Extract text from a PDF file
 */
export const extractTextFromPDF = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string | { cancel: () => void }> => {
  try {
    logInfo(`Starting PDF extraction for: ${file.name} (${file.size} bytes)`);
    
    // Use our improved PDF.js initialization
    const pdfJS = await initializePdfLib();
    
    if (!pdfJS) {
      throw new Error("Failed to initialize PDF processing library. Please refresh the page and try again.");
    }
    
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
    
    // Add better options for PDF parsing
    const loadingTask = pdfJS.getDocument({ 
      data: arrayBuffer,
      cMapUrl: '/cmaps/',
      cMapPacked: true,
      disableAutoFetch: false
    });
    
    // Set up progress tracking for loading
    loadingTask.onProgress = (data: { loaded: number, total: number }) => {
      const loadProgress = data.total ? data.loaded / data.total : 0;
      // First 20% of progress is loading the PDF
      if (onProgress) onProgress(0.1 + loadProgress * 0.1);
    };
    
    const pdf = await loadingTask.promise;
    
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
        
        // Clean up page resources to avoid memory leaks
        if (page.cleanup && typeof page.cleanup === 'function') {
          page.cleanup();
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
  // Improved implementation with smaller chunks for better memory usage
  const CHUNK_SIZE = 2; // Reduced from 5 to 2 pages at a time
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
    
    // Larger delay between chunks to allow for better garbage collection
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Try to trigger garbage collection if available (in environments that support it)
    if (typeof window !== 'undefined' && (window as any).gc) {
      try {
        (window as any).gc();
      } catch (e) {
        // Ignore if not available
      }
    }
  }
  
  // Clean the text
  if (onProgress) onProgress(0.95);
  const cleanedText = cleanOCRText(fullText);
  
  // Complete
  if (onProgress) onProgress(1.0);
  return cleanedText;
}

/**
 * Extract text from a single PDF page with improved error handling and retry logic
 */
async function extractPageText(pdf: any, pageNum: number): Promise<string> {
  const MAX_RETRIES = 2;
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Convert text items to strings
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      // Clean up page resources to avoid memory leaks
      if (page.cleanup && typeof page.cleanup === 'function') {
        page.cleanup();
      }
      
      return pageText;
    } catch (error) {
      logError(`Error extracting text from page ${pageNum}, attempt ${attempt + 1}`, { error });
      
      // Only retry if we haven't reached the max retries
      if (attempt === MAX_RETRIES) {
        return `[Error extracting text from page ${pageNum}]`;
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
    }
  }
  
  return ''; // Fallback in case all retries fail
}
