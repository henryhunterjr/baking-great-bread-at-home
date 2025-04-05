
import { cleanOCRText } from '@/lib/ai-services/text-cleaner';

/**
 * Clean and process PDF text after extraction
 */
export const processPDFText = (extractedText: string): string => {
  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error("No text was found in this PDF. It may contain only images or be scanned.");
  }
  
  // Apply text cleaning for better recipe extraction
  return cleanOCRText(extractedText);
};
