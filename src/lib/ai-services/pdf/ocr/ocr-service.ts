
import { logInfo, logError } from '@/utils/logger';
import { cleanImageOCRText } from '@/lib/ai-services/text-cleaner';

/**
 * Clean up OCR text with additional post-processing
 * @param rawText The raw OCR text
 * @returns Cleaned OCR text
 */
export const cleanupOCR = (rawText: string): string => {
  if (!rawText) return '';
  
  try {
    logInfo('Cleaning OCR text', { textLength: rawText.length });
    
    // Use the standard cleaner first
    let cleanedText = cleanImageOCRText(rawText);
    
    // Apply additional custom cleanup if needed
    // For example, specific OCR-related fixes or domain-specific improvements
    
    return cleanedText;
  } catch (error) {
    logError('Error cleaning OCR text', { error });
    // Return basic cleaned version as fallback
    return cleanImageOCRText(rawText);
  }
};
