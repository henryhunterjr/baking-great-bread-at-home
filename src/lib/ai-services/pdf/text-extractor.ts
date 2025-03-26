
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
    
    // Limit total pages for better performance
    const actualPagesToProcess = Math.min(pagesToProcess, 15); // Cap at 15 pages max for performance
    if (actualPagesToProcess < pagesToProcess) {
      logInfo("PDF text extraction: Limiting extraction to first 15 pages for performance", {
        requestedPages: pagesToProcess,
        actualPages: actualPagesToProcess
      });
    }
    
    let fullText = '';
    let extractionErrors = 0;
    
    // Process each page with a timeout
    for (let i = 1; i <= actualPagesToProcess; i++) {
      try {
        // Set a timeout for individual page extraction
        const pagePromise = pdfDocument.getPage(i);
        const page = await Promise.race([
          pagePromise,
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error(`Page ${i} extraction timed out`)), 5000)
          )
        ]) as pdfjsLib.PDFPageProxy;
        
        const textContent = await page.getTextContent();
        
        // Extract text items and join them with spaces and proper line breaks
        const pageText = textContent.items
          .map((item: any) => 'str' in item ? item.str : '')
          .join(' ')
          .replace(/\s+/g, ' '); // Normalize whitespace
        
        fullText += pageText + '\n\n';
        
        // Update progress with more granular updates
        if (progressCallback) {
          const progress = Math.floor(20 + ((i / actualPagesToProcess) * 60));
          progressCallback(progress);
        }
        
        // Clean up page resources
        page.cleanup();
      } catch (pageError) {
        extractionErrors++;
        logError('Error extracting text from page', { 
          page: i, 
          error: pageError instanceof Error ? pageError.message : 'Unknown error' 
        });
        // Continue with next page on error
      }
    }
    
    // Log extraction quality metrics
    logInfo("PDF text extraction: Completed", { 
      extractedTextLength: fullText.length,
      pagesProcessed: actualPagesToProcess,
      extractionErrors
    });
    
    // Check if we got enough content
    if (fullText.trim().length < 50 && extractionErrors > 0) {
      throw new Error("Failed to extract sufficient text from the PDF. The document may be scanned or contain mostly images.");
    }
    
    return fullText;
  } catch (error) {
    logError('Error extracting text from PDF pages', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
