
import * as pdfjsLib from 'pdfjs-dist';
import { logError } from '@/utils/logger';

/**
 * Safely destroy a PDF document
 * @param pdfDocument The PDF document to destroy
 * @param context Additional context for error logging
 */
export const safelyDestroyPdfDocument = (
  pdfDocument: pdfjsLib.PDFDocumentProxy | null, 
  context: string = "general cleanup"
): void => {
  if (pdfDocument) {
    try {
      pdfDocument.destroy();
    } catch (e) {
      logError(`Error destroying PDF document during ${context}`, { error: e });
    }
  }
};

/**
 * Clear a timeout if it exists
 * @param timeoutId The timeout ID to clear
 * @returns null after clearing the timeout
 */
export const clearTimeoutIfExists = (timeoutId: number | null): null => {
  if (timeoutId !== null) {
    window.clearTimeout(timeoutId);
  }
  return null;
};
