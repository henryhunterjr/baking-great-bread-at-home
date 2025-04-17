
import { logError, logInfo } from '@/utils/logger';
import { cleanOCRText } from '../ai-services/text-cleaner';

/**
 * Extract text from a PDF file with timeout protection
 */
export const processPDFWithTimeout = async (
  file: File,
  onProgress?: (progress: number) => void,
  timeoutMs: number = 300000 // 5 minutes default timeout
): Promise<string | { cancel: () => void }> => {
  return new Promise(async (resolve, reject) => {
    let isTimedOut = false;
    let isCancelled = false;
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      isTimedOut = true;
      reject(new Error(`PDF processing timed out after ${timeoutMs / 1000} seconds`));
    }, timeoutMs);
    
    // Cancellation function
    const cancelFunc = {
      cancel: () => {
        isCancelled = true;
        clearTimeout(timeoutId);
        resolve(cancelFunc);
      }
    };
    
    try {
      // Dynamically import the PDF.js library to avoid initialization issues
      const pdfJsLib = await import('pdfjs-dist');
      
      // Configure the worker source
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
      pdfJsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      
      // Report initial progress
      if (onProgress) onProgress(0.1);
      
      // Load document
      const arrayBuffer = await file.arrayBuffer();
      
      // Check if operation was cancelled during file reading
      if (isCancelled) {
        return resolve(cancelFunc);
      }
      
      // Initialize PDF document with better options
      const loadingTask = pdfJsLib.getDocument({
        data: arrayBuffer,
        disableAutoFetch: false,
        disableStream: false
      });
      
      // Set up progress tracking for loading
      loadingTask.onProgress = (data: { loaded: number, total: number }) => {
        const loadProgress = data.total ? data.loaded / data.total : 0;
        // First 20% of progress is loading the PDF
        if (onProgress && !isCancelled && !isTimedOut) onProgress(0.1 + loadProgress * 0.1);
      };
      
      // Wait for PDF to load
      const pdf = await loadingTask.promise;
      
      if (isCancelled || isTimedOut) {
        return resolve(cancelFunc);
      }
      
      // Check page count
      const numPages = pdf.numPages;
      logInfo(`PDF loaded with ${numPages} pages`);
      
      // Start at 20% progress after PDF is loaded
      if (onProgress) onProgress(0.2);
      
      let fullText = '';
      
      // Process each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        if (isCancelled || isTimedOut) {
          return resolve(cancelFunc);
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
      clearTimeout(timeoutId);
      
      resolve(cleanedText);
    } catch (error) {
      clearTimeout(timeoutId);
      if (!isTimedOut && !isCancelled) {
        logError('Error in PDF processing with timeout', { error });
        reject(error);
      }
    }
  });
};

/**
 * Clean and structure text extracted from PDF
 */
export const processPDFText = (text: string): string => {
  // Remove excessive whitespace
  let cleanText = text.replace(/\s+/g, ' ');
  
  // Fix common OCR issues
  cleanText = cleanText
    .replace(/(\d+)\.(\d+)/g, '$1.$2') // Fix decimals
    .replace(/([a-z])\.([A-Z])/g, '$1. $2'); // Fix sentence boundaries
  
  return cleanText.trim();
};

/**
 * Main PDF processing function - handles the extraction with proper error handling
 */
export const processPDF = async (
  file: File,
  onComplete: (text: string) => void,
  onError: (error: string) => void
) => {
  try {
    const result = await processPDFWithTimeout(file, 
      (progress) => {
        // Progress handling can be implemented here
      }
    );
    
    if (typeof result === 'string') {
      onComplete(result);
      return null; // No cancellation needed
    } else {
      // Return the cancellation function
      return result;
    }
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Failed to process PDF');
    return null;
  }
};
