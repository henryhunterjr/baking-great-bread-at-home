
import { extractTextFromPDF } from '@/lib/ai-services/pdf';
import { logError, logInfo } from '@/utils/logger';
import { cleanOCRText } from '@/lib/ai-services/text-cleaner';

/**
 * Process PDF content with timeout handling
 */
export const processPDFWithTimeout = async (
  file: File,
  onProgress?: (progress: number) => void,
  timeoutDuration: number = 300000 // 5 minutes default - increased from 3 minutes
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
        onProgress(progress);
      } : undefined;
    
    // For large files, adjust the timeout or try alternate processing method
    if (file.size > 5 * 1024 * 1024) { // If larger than 5MB
      logInfo("Large PDF detected, using alternative processing method", { fileSize: file.size });
      // Try processing complex PDF with longer timeout
      const processingPromise = processComplexPDF(file, progressCallback);
      
      const extractResult = await Promise.race([
        processingPromise,
        timeoutPromise
      ]);
      
      // Clear the timeout since we're done
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (cancelled) return null;
      
      return extractResult;
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
 * Alternative PDF processing approach for complex documents
 * Extracts text page by page to avoid memory issues with large PDFs
 */
export const processComplexPDF = async (
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
    logInfo("Processing complex PDF", { numPages, filename: file.name });
    
    if (onProgress) onProgress(0.2);
    
    // Extract text from each page individually
    let allText = '';
    for (let i = 1; i <= numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        
        // Extract text from this page
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ');
        
        allText += pageText + '\n\n';
        
        // Update progress
        if (onProgress) {
          const progress = 0.2 + 0.7 * (i / numPages);
          onProgress(progress);
        }
        
        // Clean up page to free memory
        page.cleanup();
      } catch (pageError) {
        logError(`Error processing page ${i}`, { error: pageError });
        // Continue with other pages even if one fails
      }
    }
    
    // Final progress update
    if (onProgress) onProgress(0.95);
    
    // Clean the text
    const cleanedText = cleanOCRText(allText);
    
    // Complete
    if (onProgress) onProgress(1);
    
    return cleanedText;
  } catch (error) {
    logError("Error in complex PDF processing", { error });
    throw error;
  }
};
