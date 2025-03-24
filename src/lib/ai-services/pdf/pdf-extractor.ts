
import * as pdfjsLib from 'pdfjs-dist';
import { extractTextWithOCR } from './ocr-processor';
import { convertPDFPageToImage } from './pdf-image-converter';
import { logDebug, logError, logInfo } from '@/utils/logger';

// Set the worker source using CDN to avoid bundling issues
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

// Create a cancellable task interface
interface CancellableTask {
  cancel: () => void;
}

// Type for the return value: either a string with text content or a cancellable task
type ExtractTextResult = string | CancellableTask | null;

/**
 * Extract text from a PDF file
 * @param file PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns The extracted text from the PDF or a cancellable task
 */
export const extractTextFromPDF = async (
  file: File,
  progressCallback?: (progress: number) => void
): Promise<ExtractTextResult> => {
  let isRequestCancelled = false;
  let pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;
  
  // Create a cancellable task
  const cancellableTask: CancellableTask = {
    cancel: () => {
      isRequestCancelled = true;
      if (pdfDocument) {
        try {
          pdfDocument.destroy();
        } catch (e) {
          logError("Error destroying PDF document", e);
        }
      }
    }
  };
  
  try {
    // Convert the File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Set initial progress
    if (progressCallback) progressCallback(10);
    
    logInfo("PDF processing: Starting to load document...");
    
    // Initialize PDF.js with complete options
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@5.0.375/cmaps/',
      cMapPacked: true
    });
    
    // Set a timeout for PDF loading to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('PDF loading timed out after 20 seconds')), 20000)
    );
    
    const pdfDocumentPromise = loadingTask.promise;
    
    // Race between loading and timeout
    pdfDocument = await Promise.race([
      pdfDocumentPromise,
      timeoutPromise
    ]) as pdfjsLib.PDFDocumentProxy;
    
    if (isRequestCancelled) {
      throw new Error('PDF processing was cancelled');
    }
    
    if (progressCallback) progressCallback(20);
    
    const numPages = pdfDocument.numPages;
    
    logInfo(`PDF processing: Document loaded with ${numPages} pages`);
    if (progressCallback) progressCallback(30);
    
    let fullText = '';
    
    // Extract text from each page - limit to first 5 pages for performance
    const pagesToProcess = Math.min(numPages, 5);
    
    for (let i = 1; i <= pagesToProcess; i++) {
      // Check if processing was cancelled
      if (isRequestCancelled) {
        throw new Error('PDF processing was cancelled');
      }
      
      // Update progress (distribute from 30% to 90% based on page count)
      if (progressCallback) {
        const pageProgress = 30 + Math.floor((i / pagesToProcess) * 60);
        progressCallback(pageProgress);
      }
      
      logInfo(`PDF processing: Getting page ${i}/${pagesToProcess}...`);
      
      try {
        const page = await pdfDocument.getPage(i);
        logInfo(`PDF processing: Got page ${i}, extracting text content...`);
        
        // Use the correct types for PDF.js v5
        const textContent = await page.getTextContent();
        
        // Handle items coming from getTextContent()
        const pageText = textContent.items
          .map(item => {
            // In PDF.js v5, TextItem has a 'str' property
            if ('str' in item) {
              return item.str;
            }
            return '';
          })
          .join(' ');
        
        logInfo(`PDF processing: Extracted ${pageText.length} characters from page ${i}`);
        fullText += pageText + '\n\n';
        
        // Always clean up page resources
        page.cleanup();
      } catch (pageError) {
        logError(`Error extracting text from page ${i}:`, pageError);
        // Continue with next page instead of failing completely
      }
    }
    
    // Clean up PDF document resources
    if (pdfDocument) {
      try {
        pdfDocument.destroy();
        pdfDocument = null;
      } catch (e) {
        logError("Error destroying PDF document", e);
      }
    }
    
    // Check if we extracted meaningful text
    if (fullText.trim().length < 50) {
      // Not enough text was extracted, likely a scanned PDF
      logInfo("PDF processing: Not enough text extracted, falling back to OCR");
      
      // Fall back to OCR
      if (progressCallback) progressCallback(90);
      
      try {
        // Try OCR as fallback by converting PDF to image first
        const imageDataUrl = await convertPDFPageToImage(file);
        fullText = await extractTextWithOCR(imageDataUrl, (ocrProgress) => {
          // Map OCR progress from 90% to 100%
          if (progressCallback) {
            progressCallback(90 + (ocrProgress / 10));
          }
        });
      } catch (ocrError) {
        logError('OCR fallback failed:', ocrError);
        throw new Error('Failed to extract text from PDF. The file may be corrupted or contain only images.');
      }
    }
    
    if (progressCallback) progressCallback(100);
    
    // Return extracted text or a message if nothing was found
    return fullText.trim() || "No text could be extracted from this PDF. Try another file or input method.";
  } catch (error) {
    // Clean up resources if they still exist
    if (pdfDocument) {
      try {
        pdfDocument.destroy();
      } catch (e) {
        logError("Error destroying PDF document during error handling", e);
      }
    }
    
    // Log the error
    logError('Error extracting text from PDF:', error);
    
    // If cancelled, don't try OCR fallback
    if (isRequestCancelled) {
      throw new Error('PDF processing was cancelled');
    }
    
    // Try OCR as fallback for any error
    try {
      logInfo("PDF processing: Primary extraction failed, trying OCR fallback");
      const imageDataUrl = await convertPDFPageToImage(file);
      return await extractTextWithOCR(imageDataUrl, progressCallback);
    } catch (ocrError) {
      logError('OCR fallback also failed:', ocrError);
      throw new Error('Failed to extract text from PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
  
  // Return the cancellable task if we reach this point (should not normally happen)
  return cancellableTask;
};
