
import * as pdfjsLib from 'pdfjs-dist';
import { logInfo, logError } from '@/utils/logger';
import { ProgressCallback } from './types';

/**
 * Extract text content from a single PDF page
 * @param page The PDF page to extract text from
 * @returns The extracted text as a string
 */
export const extractTextFromPage = async (page: pdfjsLib.PDFPageProxy): Promise<string> => {
  try {
    logInfo(`Extracting text from page ${page.pageNumber}`);
    
    // Get text content from the page
    const textContent = await page.getTextContent();
    
    // Convert text items to string
    const pageText = textContent.items
      .map(item => {
        // In PDF.js v5, TextItem has a 'str' property
        if ('str' in item) {
          return item.str;
        }
        return '';
      })
      .join(' ');
    
    logInfo(`Extracted ${pageText.length} characters from page ${page.pageNumber}`);
    
    // Always clean up page resources
    page.cleanup();
    
    return pageText;
  } catch (error) {
    logError(`Error extracting text from page ${page.pageNumber}:`, { error });
    
    // Clean up resources even on error
    try {
      page.cleanup();
    } catch (e) {
      // Ignore cleanup errors
    }
    
    // Return empty string on error rather than throwing
    // to allow processing to continue with other pages
    return '';
  }
};

/**
 * Extract text from multiple PDF pages
 * @param pdfDocument The PDF document to extract text from
 * @param maxPages Maximum number of pages to process (defaults to 5)
 * @param progressCallback Optional callback for progress updates
 * @returns The combined text from all processed pages
 */
export const extractTextFromPages = async (
  pdfDocument: pdfjsLib.PDFDocumentProxy, 
  maxPages: number = 5,
  progressCallback?: ProgressCallback
): Promise<string> => {
  const numPages = pdfDocument.numPages;
  const pagesToProcess = Math.min(numPages, maxPages);
  let fullText = '';
  
  for (let i = 1; i <= pagesToProcess; i++) {
    // Update progress (distribute from 30% to 90% based on page count)
    if (progressCallback) {
      const pageProgress = 30 + Math.floor((i / pagesToProcess) * 60);
      progressCallback(pageProgress);
    }
    
    logInfo(`PDF processing: Getting page ${i}/${pagesToProcess}...`);
    
    try {
      const page = await pdfDocument.getPage(i);
      const pageText = await extractTextFromPage(page);
      fullText += pageText + '\n\n';
    } catch (pageError) {
      logError(`Error processing page ${i}:`, { error: pageError });
      // Continue with next page instead of failing completely
    }
  }
  
  return fullText;
};
