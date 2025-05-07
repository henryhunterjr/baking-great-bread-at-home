
import * as pdfjsLib from 'pdfjs-dist';
import { logInfo, logError } from '@/utils/logger';
import { ProcessingError, ProcessingErrorType, ProgressCallback, CancellableTask } from './types';

// Constants
const MAX_PDF_SIZE_MB = 15;

// Try to configure worker path
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
} catch (error) {
  logError('Error configuring PDF.js worker', { error });
}

/**
 * Extract text from a PDF file with timeout protection
 */
export const extractTextFromPDF = async (
  file: File,
  onProgress?: ProgressCallback,
  timeoutMs: number = 60000 // 1 minute default timeout
): Promise<string | CancellableTask> => {
  // Validate file size before processing
  const maxSize = MAX_PDF_SIZE_MB * 1024 * 1024;
  if (file.size > maxSize) {
    throw new ProcessingError(
      `PDF file is too large (max ${MAX_PDF_SIZE_MB}MB).`,
      ProcessingErrorType.FILE_TOO_LARGE
    );
  }
  
  // Create flags for cancellation and cleanup
  let isCancelled = false;
  let loadTimeoutId: number | null = null;
  let pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;
  
  // Create cancellable task
  const cancelTask: CancellableTask = {
    cancel: () => {
      if (!isCancelled) {
        isCancelled = true;
        logInfo('PDF processing cancelled by user');
        
        // Clean up resources
        if (loadTimeoutId) {
          clearTimeout(loadTimeoutId);
        }
        
        // Try to destroy PDF document
        if (pdfDocument) {
          try {
            pdfDocument.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
          pdfDocument = null;
        }
      }
    }
  };
  
  try {
    // Report initial progress
    if (onProgress) onProgress(0.1);
    
    // Load document
    const arrayBuffer = await file.arrayBuffer();
    
    // Check if operation was cancelled during file reading
    if (isCancelled) {
      return cancelTask;
    }
    
    // Load the PDF document with better configuration
    logInfo('Loading PDF document', { fileSize: arrayBuffer.byteLength });
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: '/cmaps/',
      cMapPacked: true,
      disableAutoFetch: false
    });
    
    // Set a timeout for the initial loading
    const loadingPromise = new Promise<pdfjsLib.PDFDocumentProxy>((resolve, reject) => {
      loadTimeoutId = window.setTimeout(() => {
        reject(new ProcessingError(
          'PDF loading timed out. The file may be corrupted or too complex.',
          ProcessingErrorType.TIMEOUT
        ));
      }, 30000); // 30 seconds for loading
      
      loadingTask.promise
        .then((pdf) => {
          if (loadTimeoutId !== null) {
            clearTimeout(loadTimeoutId);
            loadTimeoutId = null;
          }
          resolve(pdf);
        })
        .catch(reject);
    });
    
    // Wait for PDF to load
    pdfDocument = await loadingPromise;
    
    if (isCancelled) {
      return cancelTask;
    }
    
    // Check page count
    const numPages = pdfDocument.numPages;
    logInfo(`PDF loaded with ${numPages} pages`);
    
    if (numPages > 100) {
      throw new ProcessingError(
        `PDF has ${numPages} pages which exceeds the limit. Please use a smaller document.`,
        ProcessingErrorType.MEMORY
      );
    }
    
    // Start at 20% progress after PDF is loaded
    if (onProgress) onProgress(0.2);
    
    let fullText = '';
    
    // Process each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (isCancelled) {
        return cancelTask;
      }
      
      try {
        const page = await pdfDocument.getPage(pageNum);
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
    
    // Complete
    if (onProgress) onProgress(1.0);
    
    return fullText.trim();
  } catch (error) {
    // Convert error to a standard format
    if (error instanceof ProcessingError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ProcessingError(
      `PDF processing error: ${errorMessage}`,
      ProcessingErrorType.EXTRACTION_FAILED
    );
  }
};
