
import * as pdfjsLib from 'pdfjs-dist';
import { logInfo, logError } from '@/utils/logger';
import { ProgressCallback } from './types';

/**
 * Extract text from all pages of a PDF document
 * @param pdfDocument The PDF document to extract text from
 * @param maxPages Maximum number of pages to process (0 = all pages)
 * @param progressCallback Optional callback for progress updates
 * @returns The extracted text as a string
 */
export const extractTextFromPages = async (
  pdfDocument: pdfjsLib.PDFDocumentProxy,
  maxPages: number = 0,
  progressCallback?: ProgressCallback
): Promise<string> => {
  try {
    const numPages = pdfDocument.numPages;
    const pagesToProcess = maxPages > 0 ? Math.min(maxPages, numPages) : numPages;
    
    logInfo("PDF text extraction: Starting extraction process", { 
      totalPages: numPages, 
      pagesToProcess 
    });
    
    let fullText = '';
    
    // Process each page
    for (let i = 1; i <= pagesToProcess; i++) {
      try {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        
        // Extract text items and join them with spaces and proper line breaks
        const pageText = textContent.items
          .map((item: any) => 'str' in item ? item.str : '')
          .join(' ')
          .replace(/\s+/g, ' '); // Normalize whitespace
        
        fullText += pageText + '\n\n';
        
        // Update progress
        if (progressCallback) {
          const progress = Math.floor(20 + ((i / pagesToProcess) * 60));
          progressCallback(progress);
        }
        
        // Clean up page resources
        page.cleanup();
      } catch (pageError) {
        logError('Error extracting text from page', { 
          page: i, 
          error: pageError instanceof Error ? pageError.message : 'Unknown error' 
        });
        // Continue with next page on error
      }
    }
    
    logInfo("PDF text extraction: Completed successfully", { 
      extractedTextLength: fullText.length 
    });
    
    return fullText;
  } catch (error) {
    logError('Error extracting text from PDF pages', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
