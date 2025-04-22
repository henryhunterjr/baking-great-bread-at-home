
import { startPerformanceTimer, endPerformanceTimer } from '@/utils/logger';
import { logError, logInfo } from '@/utils/logger';
import { cleanPDFText } from '@/lib/ai-services/text-cleaner';
import { ProcessingErrorType, ProcessingError, ProgressCallback } from './types';

/**
 * Extract text from a PDF file
 * 
 * @param file The PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns The extracted text
 */
export const extractTextFromPDF = async (
  file: File, 
  progressCallback?: ProgressCallback
): Promise<string> => {
  const perfMarkerId = `pdf-extract-${Date.now()}`;
  startPerformanceTimer(perfMarkerId);
  
  try {
    logInfo('Starting PDF text extraction', { 
      fileName: file.name,
      fileSize: file.size
    });
    
    // Report initial progress
    if (progressCallback) {
      progressCallback(0.1);
    }
    
    // Skip processing if file is too large (prevent crashes)
    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      throw new ProcessingError(
        "PDF file is too large. Please try a smaller file or break it into parts.",
        ProcessingErrorType.FILE_TOO_LARGE
      );
    }
    
    // Dynamically import PDF.js to reduce initial load time
    const pdfJS = await import('pdfjs-dist');
    
    // Set up the PDF.js worker with better error handling
    try {
      const workerSrc = '/pdf.worker.min.js';
      pdfJS.GlobalWorkerOptions.workerSrc = workerSrc;
    } catch (e) {
      logError('Failed to load local PDF worker, using CDN worker', { error: e });
      // Fallback to CDN version
      const workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      pdfJS.GlobalWorkerOptions.workerSrc = workerSrc;
    }
    
    // Report progress after setting up worker
    if (progressCallback) {
      progressCallback(0.2);
    }
    
    // Load the PDF from the file with better error handling
    let arrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (error) {
      throw new ProcessingError(
        "Failed to read PDF file. The file may be corrupted.",
        ProcessingErrorType.FILE_LOAD
      );
    }
    
    if (progressCallback) {
      progressCallback(0.3);
    }
    
    // Load document with timeout protection
    let loadingTask;
    let pdf;
    try {
      // Create loading task with better options
      loadingTask = pdfJS.getDocument({
        data: arrayBuffer,
        nativeImageDecoderSupport: 'display',
        isEvalSupported: false,
        disableFontFace: false
      });
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('PDF loading timed out')), 30000); // 30 second timeout
      });
      
      // Race between loading and timeout
      pdf = await Promise.race([
        loadingTask.promise,
        timeoutPromise
      ]);
    } catch (error) {
      if (error.message.includes('timeout')) {
        throw new ProcessingError(
          "PDF processing timed out. The file may be too complex.",
          ProcessingErrorType.TIMEOUT
        );
      } else {
        throw new ProcessingError(
          `Failed to load PDF document: ${error.message}`,
          ProcessingErrorType.FILE_LOAD
        );
      }
    }
    
    if (!pdf) {
      throw new ProcessingError(
        "Failed to load PDF document.",
        ProcessingErrorType.FILE_LOAD
      );
    }
    
    const numPages = pdf.numPages;
    
    logInfo('PDF loaded successfully', { numPages });
    
    if (progressCallback) {
      progressCallback(0.4);
    }
    
    // Extract text from each page with improved error handling
    let allText = '';
    let processedPages = 0;
    
    // Process pages with smaller batches to prevent memory issues
    const BATCH_SIZE = 5;
    for (let startPage = 1; startPage <= numPages; startPage += BATCH_SIZE) {
      const endPage = Math.min(startPage + BATCH_SIZE - 1, numPages);
      
      // Process batch of pages
      for (let i = startPage; i <= endPage; i++) {
        try {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          
          // Combine text items into a single string
          const pageText = content.items
            .filter((item: any) => item.str) // Filter out empty items
            .map((item: any) => item.str)
            .join(' ');
          
          allText += pageText + '\n\n';
          processedPages++;
          
          // Report progress based on page completion
          if (progressCallback) {
            const progress = 0.4 + (0.5 * (processedPages / numPages));
            progressCallback(Math.min(progress, 0.9)); // Cap at 90% until fully complete
          }
          
          // Help with memory management
          page.cleanup?.();
        } catch (pageError) {
          // Log error but continue with other pages
          logError(`Error extracting text from page ${i}`, { error: pageError });
          allText += `[Error extracting text from page ${i}]\n\n`;
        }
      }
      
      // Small delay between batches to allow garbage collection
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // Clean up the text
    allText = cleanPDFText(allText);
    
    // Report extraction is complete
    if (progressCallback) {
      progressCallback(1.0);
    }
    
    // Record performance metrics
    const totalTime = endPerformanceTimer(
      perfMarkerId, 
      'PDF text extraction',
      { numPages, textLength: allText.length, processedPages }
    );
    
    logInfo('PDF text extraction completed', {
      processingTimeMs: totalTime,
      numPages,
      processedPages,
      textLength: allText.length
    });
    
    return allText;
  } catch (error) {
    // End performance timer with error
    endPerformanceTimer(perfMarkerId, 'PDF text extraction failed');
    
    // Determine error type
    let errorType = ProcessingErrorType.EXTRACTION_FAILED;
    let errorMessage = 'Failed to extract text from PDF';
    
    if (error instanceof ProcessingError) {
      // Re-throw existing ProcessingError
      throw error;
    } else if (error instanceof Error) {
      if (error.message.includes('worker')) {
        errorType = ProcessingErrorType.NETWORK;
        errorMessage = 'Failed to load PDF processing worker. Please check your network connection.';
      } else if (error.message.includes('load')) {
        errorType = ProcessingErrorType.FILE_LOAD;
        errorMessage = 'Failed to load PDF file. The file may be corrupted or password protected.';
      } else if (error.message.includes('memory')) {
        errorType = ProcessingErrorType.MEMORY;
        errorMessage = 'Not enough memory to process this PDF. Please try a smaller file.';
      }
      
      errorMessage += ': ' + error.message;
    }
    
    logError('PDF extraction error', { 
      error, 
      type: errorType,
      fileName: file.name
    });
    
    throw new ProcessingError(errorMessage, errorType);
  }
};
