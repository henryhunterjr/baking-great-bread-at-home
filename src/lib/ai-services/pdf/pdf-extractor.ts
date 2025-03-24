
import * as pdfjsLib from 'pdfjs-dist';
import { extractTextWithOCR } from './ocr-processor';
import { convertPDFPageToImage } from './pdf-image-converter';
import { logDebug, logError, logInfo } from '@/utils/logger';

// We don't need to set the worker path again if it's already set in pdf-image-converter
// Just make a reference to ensure the worker path is correctly configured
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
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
  try {
    // Convert the File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Set initial progress
    if (progressCallback) progressCallback(10);
    
    logInfo("PDF processing: Starting to load document...");
    
    // Initialize PDF.js with complete options
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: true,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@5.0.375/cmaps/',
      cMapPacked: true
    });
    
    // Set a timeout for PDF loading to prevent hanging
    const loadingPromise = Promise.race([
      loadingTask.promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PDF loading timed out')), 30000)
      )
    ]);
    
    if (progressCallback) progressCallback(20);
    
    logInfo("PDF processing: Waiting for document to load...");
    const pdf = await loadingPromise as pdfjsLib.PDFDocumentProxy;
    
    const numPages = pdf.numPages;
    
    logInfo(`PDF processing: Document loaded with ${numPages} pages`);
    if (progressCallback) progressCallback(30);
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      // Update progress (distribute from 30% to 90% based on page count)
      if (progressCallback) {
        const pageProgress = 30 + Math.floor((i / numPages) * 60);
        progressCallback(pageProgress);
      }
      
      logInfo(`PDF processing: Getting page ${i}/${numPages}...`);
      
      try {
        const page = await pdf.getPage(i);
        logInfo(`PDF processing: Got page ${i}, extracting text content...`);
        
        const textContent = await page.getTextContent();
        
        // Use type assertion to access items safely
        const pageText = textContent.items
          // @ts-ignore - Handle PDF.js v5 type differences
          .map(item => item.str || '')
          .join(' ');
        
        logInfo(`PDF processing: Extracted ${pageText.length} characters from page ${i}`);
        fullText += pageText + '\n\n';
      } catch (pageError) {
        logError(`Error extracting text from page ${i}:`, pageError);
        // Continue with next page instead of failing completely
      }
    }
    
    // Check if we extracted meaningful text
    if (fullText.trim().length < 50) {
      // Not enough text was extracted, likely a scanned PDF
      logInfo("PDF processing: Not enough text extracted, falling back to OCR");
      
      // Fall back to OCR
      if (progressCallback) progressCallback(90);
      
      try {
        // Try OCR as fallback
        const image = await convertPDFPageToImage(file);
        fullText = await extractTextWithOCR(image, (ocrProgress) => {
          // Map OCR progress from 90% to 100%
          if (progressCallback) {
            progressCallback(90 + (ocrProgress / 10));
          }
        });
      } catch (ocrError) {
        logError('OCR fallback failed:', ocrError);
        throw new Error('Failed to extract text from PDF');
      }
    }
    
    if (progressCallback) progressCallback(100);
    
    return fullText || "No text could be extracted from this PDF.";
  } catch (error) {
    logError('Error extracting text from PDF:', error);
    
    // Try OCR as fallback for any error
    try {
      logInfo("PDF processing: Primary extraction failed, trying OCR fallback");
      const image = await convertPDFPageToImage(file);
      return await extractTextWithOCR(image, progressCallback);
    } catch (ocrError) {
      logError('OCR fallback also failed:', ocrError);
      throw new Error('Failed to extract text from PDF');
    }
  }
};
