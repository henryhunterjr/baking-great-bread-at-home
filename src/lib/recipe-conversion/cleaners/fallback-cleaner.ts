
import { logInfo } from '@/utils/logger';

/**
 * Fallback cleaner with basic functionality
 * This is used if the enhanced cleaner fails
 */
export const fallbackCleanOCRText = (text: string): string => {
  if (!text) return '';
  
  logInfo("Using fallback OCR text cleaner");
  
  // Simple whitespace normalization
  let cleaned = text.replace(/\r\n/g, '\n');
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Basic fraction fixes
  cleaned = cleaned
    .replace(/l\/2/g, '1/2')
    .replace(/l\/4/g, '1/4')
    .replace(/l\/3/g, '1/3')
    .replace(/(\d+)\/(\d+)/g, '$1/$2');
  
  // Basic measurement fixes
  cleaned = cleaned
    .replace(/(\d+)\s+([cmt]?[lbgks])/gi, '$1$2')
    .replace(/(\d+)\s*[oO°]\s*([CF])/gi, '$1°$2');
  
  // Add dual measurements for common units
  cleaned = cleaned
    .replace(/(\d+)\s*cups?\b/gi, '$1 cups (240ml per cup) ')
    .replace(/(\d+)\s*tbsp\b/gi, '$1 tbsp (15ml) ')
    .replace(/(\d+)\s*tsp\b/gi, '$1 tsp (5ml) ')
    .replace(/(\d+)\s*oz\b/gi, '$1 oz (28g) ')
    .replace(/(\d+)\s*pounds?\b/gi, '$1 lb (454g) ');
  
  return cleaned.trim();
};
