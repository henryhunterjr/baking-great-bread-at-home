
import { logError, logInfo } from '@/utils/logger';
import * as pdfjsLib from 'pdfjs-dist';

/**
 * Safely destroy a PDF document and clean up resources
 * @param pdfDocument The PDF document to destroy
 * @param reason The reason for destruction (for logging)
 */
export const safelyDestroyPdfDocument = (
  pdfDocument: pdfjsLib.PDFDocumentProxy | null,
  reason: 'success' | 'error' | 'timeout' | 'cancellation' = 'success'
): void => {
  if (!pdfDocument) return;
  
  try {
    pdfDocument.destroy().catch(error => {
      logError('Error destroying PDF document', { error, reason });
    });
    
    logInfo('PDF document destroyed', { reason });
  } catch (error) {
    logError('Error destroying PDF document', { error, reason });
  }
};

/**
 * Clear timeout if it exists and return null
 * @param timeoutId The timeout ID to clear
 * @returns null
 */
export const clearTimeoutIfExists = (timeoutId: number | null): null => {
  if (timeoutId !== null) {
    window.clearTimeout(timeoutId);
  }
  return null;
};
