
import { logInfo, logError } from '@/utils/logger';
import type * as pdfjsLib from 'pdfjs-dist';
import { ProgressCallback } from './types';
import { cleanExtractedText } from './text-cleaner';

/**
 * Extract text from all pages of a PDF document
 * @param pdfDocument The PDF document to extract text from
 * @param maxPages Maximum number of pages to process (for performance)
 * @param progressCallback Callback for progress updates
 * @returns The extracted text from all pages
 */
export const extractTextFromPages = async (
  pdfDocument: pdfjsLib.PDFDocumentProxy,
  maxPages: number = 0,
  progressCallback?: ProgressCallback
): Promise<string> => {
  try {
    const numPages = pdfDocument.numPages;
    const actualMaxPages = maxPages > 0 ? Math.min(maxPages, numPages) : numPages;
    
    logInfo(`Starting text extraction from PDF with ${numPages} pages`, {
      totalPages: numPages,
      processingPages: actualMaxPages
    });
    
    let allText = '';
    
    // Extract text from each page
    for (let i = 1; i <= actualMaxPages; i++) {
      try {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        
        // Extract text from the page content
        const pageText = textContent.items
          .map(item => 'str' in item ? item.str : '')
          .join(' ');
        
        allText += pageText + '\n';
        
        // Clean up page resources
        page.cleanup();
        
        // Report progress
        if (progressCallback) {
          const progressPercent = Math.round(20 + (i / actualMaxPages) * 50);
          progressCallback(progressPercent);
        }
        
        logInfo(`Extracted text from page ${i}/${actualMaxPages}`, { 
          pageNumber: i, 
          textLength: pageText.length 
        });
      } catch (pageError) {
        logError(`Error extracting text from page ${i}`, { error: pageError });
        // Continue to the next page even if this one fails
      }
    }
    
    // Clean the extracted text
    const cleanedText = cleanExtractedText(allText);
    
    return cleanedText;
  } catch (error) {
    logError('Error extracting text from PDF pages', { error });
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
