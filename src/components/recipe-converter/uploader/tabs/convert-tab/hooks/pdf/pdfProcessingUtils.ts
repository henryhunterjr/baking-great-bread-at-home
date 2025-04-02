
import { extractTextFromPDF } from '@/lib/ai-services/pdf';
import { logError, logInfo } from '@/utils/logger';
import { cleanOCRText } from '@/lib/ai-services/text-cleaner';

/**
 * Process PDF content with timeout handling
 */
export const processPDFWithTimeout = async (
  file: File,
  onProgress?: (progress: number) => void,
  timeoutDuration: number = 600000 // 10 minutes default - increased from 5 minutes
): Promise<string | { cancel: () => void } | null> => {
  let timeoutId: NodeJS.Timeout | null = null;
  let cancelled = false;
  
  try {
    logInfo("Processing PDF with timeout", { 
      filename: file.name, 
      filesize: file.size, 
      timeout: timeoutDuration 
    });
    
    // Set a timeout to prevent indefinite processing
    const timeoutPromise = new Promise<null>((_, reject) => {
      timeoutId = setTimeout(() => {
        cancelled = true;
        reject(new Error(`PDF processing timed out after ${timeoutDuration/60000} minutes.`));
      }, timeoutDuration);
    });
    
    // Create a progress wrapper that checks for cancellation
    const progressCallback = onProgress ? 
      (progress: number) => {
        if (cancelled) return;
        
        // Update progress with more granular reporting
        // Report more realistic progress that never reaches 100% until complete
        const adjustedProgress = progress * 0.95; // Cap at 95% until fully complete
        onProgress(adjustedProgress);
      } : undefined;
    
    // For large files, adjust the timeout or try alternate processing method
    if (file.size > 5 * 1024 * 1024) { // If larger than 5MB
      logInfo("Large PDF detected, using chunked processing method", { fileSize: file.size });
      
      // Use a different processing method for large PDFs
      try {
        // Process the PDF in chunks to avoid memory issues
        const extractResult = await processLargePDFInChunks(file, progressCallback);
        
        // Clear the timeout since we're done
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        if (cancelled) return null;
        
        return extractResult;
      } catch (chunkError) {
        logError("Chunked processing failed, falling back to standard method", { error: chunkError });
        // Fall back to standard processing
      }
    }
    
    // Race the actual extraction against the timeout
    const extractResult = await Promise.race([
      extractTextFromPDF(file, progressCallback),
      timeoutPromise
    ]);
    
    // Clear the timeout since we're done
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Check if processing was cancelled
    if (cancelled) return null;
    
    return extractResult;
  } catch (error) {
    logError("Error in PDF processing with timeout", { error });
    
    // Clear the timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // If it's a timeout error, provide a more helpful message
    if (error instanceof Error && error.message.includes('timed out')) {
      throw new Error(`PDF processing timed out after ${timeoutDuration/60000} minutes. This may be due to the file being too large or complex. Try extracting just the recipe text and using the text input tab instead.`);
    }
    
    // Rethrow the error for the caller to handle
    throw error;
  }
};

/**
 * Clean and process PDF text after extraction
 */
export const processPDFText = (extractedText: string): string => {
  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error("No text was found in this PDF. It may contain only images or be scanned.");
  }
  
  // Apply text cleaning for better recipe extraction
  return cleanOCRText(extractedText);
};

/**
 * Process large PDFs in smaller chunks to avoid memory issues
 * This is a more efficient approach for large documents
 */
const processLargePDFInChunks = async (
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
          logError(`Error processing page ${startPage + pageNum}`, { error: pageError });
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
