
import * as pdfjsLib from 'pdfjs-dist';
import { logInfo, logError } from '@/utils/logger';
import { 
  CancellableTask, 
  ExtractTextResult, 
  ProcessingError, 
  ProcessingErrorType, 
  ProgressCallback, 
  TextExtractionOptions 
} from '../types';
import { 
  MAX_PDF_SIZE_MB, 
  MAX_PAGES_TO_PROCESS, 
  PDF_LOAD_TIMEOUT, 
  PDF_TOTAL_TIMEOUT 
} from '../utils/pdf-validator';
import { createCancellableTimeout } from '../utils/timeout-utils';
import { safelyDestroyPdfDocument, clearTimeoutIfExists } from '../utils/cleanup-utils';
import { cleanPDFText } from '@/lib/ai-services/text-cleaner';

// Try to configure PDF.js workers
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
} catch (error) {
  logError('Error configuring PDF.js worker', { error });
}

/**
 * Extract text from a PDF file with enhanced reliability and error handling
 * 
 * @param file PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @param options Additional options for extraction
 * @returns The extracted text from the PDF or a cancellable task
 */
export const extractTextFromPDF = async (
  file: File,
  progressCallback?: ProgressCallback,
  options: TextExtractionOptions = {}
): Promise<ExtractTextResult> => {
  // Set default options
  const useOCR = options.useOCR ?? false;
  const timeoutMs = options.timeoutMs ?? PDF_TOTAL_TIMEOUT;
  
  // Validate file size (moved here from the validator to consolidate logic)
  const maxSize = MAX_PDF_SIZE_MB * 1024 * 1024;
  if (file.size > maxSize) {
    throw new ProcessingError(
      `PDF file is too large (max ${MAX_PDF_SIZE_MB}MB).`,
      ProcessingErrorType.FILE_LOAD
    );
  }
  
  // Validate file type
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new ProcessingError(
      'Invalid file type. Please upload a PDF document.',
      ProcessingErrorType.FILE_LOAD
    );
  }
  
  // Create flags for cancellation and tracking
  let isCancelled = false;
  let isCompleted = false;
  let pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;
  let loadTimeoutId: number | null = null;
  let totalTimeoutId: number | null = null;
  
  // Function to clean up resources
  const cleanup = (reason: 'success' | 'error' | 'timeout' | 'cancellation') => {
    loadTimeoutId = clearTimeoutIfExists(loadTimeoutId);
    totalTimeoutId = clearTimeoutIfExists(totalTimeoutId);
    safelyDestroyPdfDocument(pdfDocument, reason);
    pdfDocument = null;
  };
  
  // Create a cancellable task
  const cancellableTask: CancellableTask = {
    cancel: () => {
      if (!isCompleted && !isCancelled) {
        isCancelled = true;
        logInfo('PDF processing cancelled by user');
        cleanup('cancellation');
      }
    }
  };
  
  try {
    // Set a timeout for the entire operation
    const { timeoutId, cancel: cancelTotalTimeout } = createCancellableTimeout(() => {
      if (!isCompleted && !isCancelled) {
        isCancelled = true;
        logError('PDF processing timed out', { timeout: timeoutMs });
        cleanup('timeout');
        throw new ProcessingError(
          `PDF processing timed out after ${timeoutMs / 1000} seconds.`,
          ProcessingErrorType.TIMEOUT
        );
      }
    }, timeoutMs);
    
    totalTimeoutId = timeoutId;
    
    // Report initial progress
    if (progressCallback) progressCallback(0.05);
    
    // Create array buffer from file
    const arrayBuffer = await readFileAsArrayBuffer(file);
    
    if (isCancelled) return cancellableTask;
    
    // Set a timeout for the initial PDF loading
    const { timeoutId: loadTimeout, cancel: cancelLoadTimeout } = createCancellableTimeout(() => {
      if (!pdfDocument && !isCancelled) {
        isCancelled = true;
        logError('PDF document loading timed out', { timeout: PDF_LOAD_TIMEOUT });
        cleanup('timeout');
        throw new ProcessingError(
          'PDF document loading timed out. The file may be corrupted or too complex.',
          ProcessingErrorType.TIMEOUT
        );
      }
    }, PDF_LOAD_TIMEOUT);
    
    loadTimeoutId = loadTimeout;
    
    // Load the PDF document
    logInfo('Loading PDF document', { fileSize: file.size });
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    pdfDocument = await loadingTask.promise;
    
    // Clear the loading timeout since we succeeded
    cancelLoadTimeout();
    loadTimeoutId = null;
    
    if (isCancelled) {
      safelyDestroyPdfDocument(pdfDocument, 'cancellation');
      return cancellableTask;
    }
    
    // Report progress after document loading
    if (progressCallback) progressCallback(0.1);
    
    // Get the total number of pages
    const numPages = pdfDocument.numPages;
    logInfo('PDF document loaded', { numPages, fileSize: file.size });
    
    // Calculate how many pages to process
    const pagesToProcess = Math.min(numPages, MAX_PAGES_TO_PROCESS);
    
    if (numPages > MAX_PAGES_TO_PROCESS) {
      logInfo('Limiting PDF processing to first pages', { 
        totalPages: numPages, 
        pagesToProcess: MAX_PAGES_TO_PROCESS 
      });
    }
    
    // Extract text from pages with retry logic
    const extractedTexts: string[] = [];
    
    // Use a weighted progress calculation based on number of pages
    const progressPerPage = 0.9 / pagesToProcess; // 90% of progress divided by pages
    const baseProgress = 0.1; // First 10% was for loading the document
    
    // Process pages with retries for each page
    for (let i = 1; i <= pagesToProcess; i++) {
      if (isCancelled) break;
      
      const pageNum = i;
      let pageAttempts = 0;
      const MAX_PAGE_RETRIES = 3;
      
      // Report progress at the start of each page
      if (progressCallback) {
        progressCallback(baseProgress + (i - 1) * progressPerPage);
      }
      
      while (pageAttempts < MAX_PAGE_RETRIES) {
        try {
          pageAttempts++;
          
          // Get the page and extract its text content
          const page = await pdfDocument.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Process the text content
          const pageText = textContent.items
            .map(item => 'str' in item ? item.str : '')
            .join(' ');
          
          extractedTexts.push(pageText);
          
          // Report progress after each page
          if (progressCallback) {
            progressCallback(baseProgress + i * progressPerPage);
          }
          
          // We succeeded, so break the retry loop
          break;
        } catch (error) {
          logError(`Error extracting text from page ${pageNum}`, { 
            error, 
            attempt: pageAttempts, 
            maxRetries: MAX_PAGE_RETRIES 
          });
          
          // If this is the last retry, continue to the next page
          if (pageAttempts >= MAX_PAGE_RETRIES) {
            logError(`Failed to extract text from page ${pageNum} after ${MAX_PAGE_RETRIES} attempts`);
            // Add a placeholder for this page
            extractedTexts.push(`[Error extracting text from page ${pageNum}]`);
          } else {
            // Wait before retrying with exponential backoff
            const backoffTime = Math.pow(2, pageAttempts) * 100;
            await new Promise(resolve => setTimeout(resolve, backoffTime));
          }
        }
        
        if (isCancelled) break;
      }
    }
    
    if (isCancelled) {
      cleanup('cancellation');
      return cancellableTask;
    }
    
    // Combine the text from all pages
    const combinedText = extractedTexts.join('\n\n');
    
    // Report progress before cleanup
    if (progressCallback) progressCallback(1.0);
    
    // Clean up resources
    isCompleted = true;
    cleanup('success');
    cancelTotalTimeout();
    
    // Clean the text before returning
    const cleanedText = cleanPDFText(combinedText);
    
    logInfo('PDF text extraction complete', { 
      extractedLength: combinedText.length,
      cleanedLength: cleanedText.length
    });
    
    return cleanedText;
  } catch (error) {
    // Handle any uncaught errors
    isCompleted = true;
    cleanup('error');
    
    // Wrap the error in a ProcessingError if it's not already
    if (!(error instanceof ProcessingError)) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('worker') || errorMessage.includes('network')) {
        throw new ProcessingError(
          `PDF processing error: ${errorMessage}`,
          ProcessingErrorType.NETWORK
        );
      } else {
        throw new ProcessingError(
          `PDF processing error: ${errorMessage}`,
          ProcessingErrorType.EXTRACTION_FAILED
        );
      }
    } else {
      throw error;
    }
  }
};

/**
 * Helper function to read a file as ArrayBuffer with timeout
 */
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result instanceof ArrayBuffer) {
        resolve(event.target.result);
      } else {
        reject(new ProcessingError(
          'Failed to read PDF file as ArrayBuffer',
          ProcessingErrorType.FILE_LOAD
        ));
      }
    };
    
    reader.onerror = () => {
      reject(new ProcessingError(
        'Error reading PDF file',
        ProcessingErrorType.FILE_LOAD
      ));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
