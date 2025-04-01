
import * as pdfjsLib from 'pdfjs-dist';
import { logInfo, logError } from '@/utils/logger';
import { 
  CancellableTask, 
  ProcessingError, 
  ProcessingErrorType,
  ProgressCallback,
  ExtractTextResult,
  TextExtractionOptions
} from '../types';
import { readFileAsArrayBuffer } from './helpers/file-helpers';
import { cleanText } from './helpers/text-helpers';
import { safelyDestroyPdfDocument, clearTimeoutIfExists } from '../utils/cleanup-utils';
import { createCancellableTimeout } from '../utils/timeout-utils';

// Constants
const MAX_PDF_SIZE_MB = 15;
const MAX_PAGES_TO_PROCESS = 15;
const PDF_LOAD_TIMEOUT = 30000; // 30 seconds
const PDF_TOTAL_TIMEOUT = 120000; // 2 minutes

// Try to configure PDF.js workers
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
} catch (error) {
  logError('Error configuring PDF.js worker', { error });
}

/**
 * Extract text from a PDF file with enhanced reliability and error handling
 */
export const extractTextFromPDF = async (
  file: File,
  progressCallback?: ProgressCallback,
  options: TextExtractionOptions = {}
): Promise<ExtractTextResult> => {
  // Set default options
  const useOCRFallback = false; // Default to not using OCR fallback
  const timeoutMs = options.timeout ?? PDF_TOTAL_TIMEOUT;
  
  // Validate file size before processing
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
    
    // Set up load timeout and process the PDF
    const result = await processPdfWithTimeout(
      arrayBuffer, 
      progressCallback, 
      isCancelled, 
      cancellableTask,
      (doc) => { pdfDocument = doc; }
    );
    
    // If processing was cancelled during document loading
    if (isCancelled) {
      cleanup('cancellation');
      return cancellableTask;
    }
    
    // Clean up resources
    isCompleted = true;
    cleanup('success');
    cancelTotalTimeout();
    
    return result;
  } catch (error) {
    // Handle any uncaught errors
    isCompleted = true;
    cleanup('error');
    
    throw wrapProcessingError(error);
  }
};

// Helper for processing PDF with timeout
async function processPdfWithTimeout(
  arrayBuffer: ArrayBuffer,
  progressCallback?: ProgressCallback,
  isCancelled?: boolean,
  cancellableTask?: CancellableTask,
  setDocument?: (doc: pdfjsLib.PDFDocumentProxy) => void
): Promise<string> {
  let pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;
  let loadTimeoutId: number | null = null;
  
  try {
    // Set a timeout for the initial PDF loading
    const { timeoutId, cancel: cancelLoadTimeout } = createCancellableTimeout(() => {
      if (!pdfDocument && !isCancelled) {
        throw new ProcessingError(
          'PDF document loading timed out. The file may be corrupted or too complex.',
          ProcessingErrorType.TIMEOUT
        );
      }
    }, PDF_LOAD_TIMEOUT);
    
    loadTimeoutId = timeoutId;
    
    // Load the PDF document
    logInfo('Loading PDF document', { fileSize: arrayBuffer.byteLength });
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    pdfDocument = await loadingTask.promise;
    
    // Call the setter if provided
    if (setDocument) {
      setDocument(pdfDocument);
    }
    
    // Clear the loading timeout since we succeeded
    cancelLoadTimeout();
    loadTimeoutId = null;
    
    if (isCancelled) {
      return '';
    }
    
    // Report progress after document loading
    if (progressCallback) progressCallback(0.1);
    
    // Get the total number of pages
    const numPages = pdfDocument.numPages;
    logInfo('PDF document loaded', { numPages, fileSize: arrayBuffer.byteLength });
    
    // Extract text from pages
    const extractedTexts = await extractTextFromPages(
      pdfDocument, 
      numPages,
      progressCallback,
      isCancelled
    );
    
    if (isCancelled) {
      return '';
    }
    
    // Combine the text from all pages
    const combinedText = extractedTexts.join('\n\n');
    
    // Report progress before cleanup
    if (progressCallback) progressCallback(1.0);
    
    // Clean the text before returning
    const cleanedText = cleanText(combinedText);
    
    logInfo('PDF text extraction complete', { 
      extractedLength: combinedText.length,
      cleanedLength: cleanedText.length
    });
    
    return cleanedText;
  } finally {
    if (loadTimeoutId !== null) {
      clearTimeoutIfExists(loadTimeoutId);
    }
  }
}

// Wrap errors in a standardized ProcessingError
function wrapProcessingError(error: unknown): ProcessingError {
  if (error instanceof ProcessingError) {
    return error;
  }
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('worker') || errorMessage.includes('network')) {
    return new ProcessingError(
      `PDF processing error: ${errorMessage}`,
      ProcessingErrorType.NETWORK
    );
  } else {
    return new ProcessingError(
      `PDF processing error: ${errorMessage}`,
      ProcessingErrorType.EXTRACTION_FAILED
    );
  }
}

// Helper for extracting text from PDF pages
async function extractTextFromPages(
  pdfDocument: pdfjsLib.PDFDocumentProxy,
  numPages: number,
  progressCallback?: ProgressCallback,
  isCancelled?: boolean
): Promise<string[]> {
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
  
  return extractedTexts;
}
