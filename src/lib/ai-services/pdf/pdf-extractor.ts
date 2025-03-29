
import { logError, logInfo, startPerformanceTimer, endPerformanceTimer } from '@/utils/logger';
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
    
    // Dynamically import PDF.js to reduce initial load time
    const pdfJS = await import('pdfjs-dist');
    
    // Set up the PDF.js worker
    // First try to use the local worker, and if that fails, use a CDN version
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
    
    // Load the PDF from the file
    const arrayBuffer = await file.arrayBuffer();
    
    if (progressCallback) {
      progressCallback(0.3);
    }
    
    // Load document
    const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    
    logInfo('PDF loaded successfully', { numPages });
    
    if (progressCallback) {
      progressCallback(0.4);
    }
    
    // Extract text from each page
    let allText = '';
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      // Combine text items into a single string
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      
      allText += pageText + '\n\n';
      
      // Report progress based on page completion
      if (progressCallback) {
        const progress = 0.4 + (0.5 * (i / numPages));
        progressCallback(progress);
      }
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
      { numPages, textLength: allText.length }
    );
    
    logInfo('PDF text extraction completed', {
      processingTimeMs: totalTime,
      numPages,
      textLength: allText.length
    });
    
    return allText;
  } catch (error) {
    // End performance timer with error
    endPerformanceTimer(perfMarkerId, 'PDF text extraction failed');
    
    // Determine error type
    let errorType = ProcessingErrorType.EXTRACTION_FAILED;
    let errorMessage = 'Failed to extract text from PDF';
    
    if (error instanceof Error) {
      if (error.message.includes('worker')) {
        errorType = ProcessingErrorType.NETWORK;
        errorMessage = 'Failed to load PDF processing worker. Please check your network connection.';
      } else if (error.message.includes('load')) {
        errorType = ProcessingErrorType.FILE_LOAD;
        errorMessage = 'Failed to load PDF file. The file may be corrupted or password protected.';
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
