
import * as pdfjsLib from 'pdfjs-dist';
import { extractTextWithOCR } from './ocr-processor';
import { convertPDFPageToImage } from './pdf-image-converter';
import { logDebug, logError, logInfo } from '@/utils/logger';

// Make sure we set the worker path correctly
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
}

/**
 * Extract text from a PDF file
 * @param file PDF file to process
 * @param progressCallback Optional callback for progress updates
 * @returns The extracted text from the PDF
 */
export const extractTextFromPDF = async (
  file: File,
  progressCallback?: (progress: number) => void
): Promise<string> => {
  let abortController = new AbortController();
  
  try {
    // Convert the File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Set initial progress
    if (progressCallback) progressCallback(10);
    
    logInfo("PDF processing: Starting to load document...");
    
    // Initialize PDF.js with better options and explicit worker source
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: true,
      disableFontFace: true,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.0.375/cmaps/',
      cMapPacked: true,
    });
    
    // Create a timeout to detect if loading hangs
    const pdfLoadTimeout = setTimeout(() => {
      logError("PDF loading has timed out");
      loadingTask.destroy();
      throw new Error('PDF loading timed out');
    }, 30000); // 30 second timeout
    
    // Add event listeners for better debugging
    loadingTask.onProgress = (data) => {
      const progress = data.loaded / (data.total || 1) * 100;
      logDebug(`PDF loading progress: ${Math.round(progress)}%`);
      if (progressCallback) progressCallback(10 + Math.round(progress * 0.2)); // Map to 10-30% range
    };
    
    logInfo("PDF processing: Waiting for document to load...");
    const pdf = await loadingTask.promise;
    
    // Clear the load timeout since we've loaded successfully
    clearTimeout(pdfLoadTimeout);
    
    const numPages = pdf.numPages;
    
    logInfo(`PDF processing: Document loaded with ${numPages} pages`);
    if (progressCallback) progressCallback(30);
    
    // Set a timeout for the entire extraction process
    const extractionTimeout = setTimeout(() => {
      logError("PDF text extraction has timed out");
      abortController.abort();
      throw new Error('PDF text extraction timed out');
    }, 60000); // 60 second timeout
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= numPages && !abortController.signal.aborted; i++) {
      // Update progress (distribute from 30% to 90% based on page count)
      if (progressCallback) {
        const pageProgress = 30 + Math.floor((i / numPages) * 60);
        progressCallback(pageProgress);
      }
      
      logInfo(`PDF processing: Getting page ${i}/${numPages}...`);
      try {
        const page = await pdf.getPage(i);
        logInfo(`PDF processing: Got page ${i}, extracting text content...`);
        
        // Set a timeout for each page extraction
        const pageExtractionPromise = page.getTextContent();
        
        // Create a race promise to handle potential hanging
        const pageTextContent = await Promise.race([
          pageExtractionPromise,
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Timeout extracting text from page ${i}`)), 15000);
          })
        ]);
        
        // Extract text items and join them
        // Use type assertion to access items safely - fixes the TextContent type error
        const textItems = (pageTextContent as any).items || [];
        const pageText = textItems
          .map((item: any) => item.str || '')
          .join(' ');
        
        logInfo(`PDF processing: Extracted ${pageText.length} characters from page ${i}`);
        fullText += pageText + '\n\n';
      } catch (pageError) {
        logError(`Error extracting text from page ${i}:`, { error: pageError });
        // Continue with next page instead of failing completely
      }
    }
    
    // Clear the extraction timeout
    clearTimeout(extractionTimeout);
    
    // Check if extraction was aborted
    if (abortController.signal.aborted) {
      throw new Error('PDF processing was cancelled');
    }
    
    // Check if we extracted meaningful text
    if (fullText.trim().length < 50) {
      // Not enough text was extracted, likely a scanned PDF
      logInfo("PDF processing: Not enough text extracted, falling back to OCR");
      
      // Fall back to OCR
      if (progressCallback) progressCallback(90);
      
      // Try OCR as fallback
      const image = await convertPDFPageToImage(file);
      fullText = await extractTextWithOCR(image, (ocrProgress) => {
        // Map OCR progress from 90% to 100%
        if (progressCallback) {
          progressCallback(90 + (ocrProgress / 10));
        }
      });
    }
    
    if (progressCallback) progressCallback(100);
    
    return fullText || "No text could be extracted from this PDF.";
  } catch (error) {
    logError('Error extracting text from PDF:', { error });
    
    // Try OCR as fallback for any error
    try {
      logInfo("PDF processing: Primary extraction failed, trying OCR fallback");
      const image = await convertPDFPageToImage(file);
      return await extractTextWithOCR(image, progressCallback);
    } catch (ocrError) {
      logError('OCR fallback also failed:', { error: ocrError });
      throw new Error('Failed to extract text from PDF');
    }
  }
};
