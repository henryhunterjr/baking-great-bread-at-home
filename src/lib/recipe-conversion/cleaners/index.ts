
import { logInfo, logError } from '@/utils/logger';
import { fixFractions } from './fraction-cleaner';
import { fixMeasurements } from './measurement-cleaner';
import { fixCookingTerms } from './cooking-terms-cleaner';
import { fixSectionHeaders } from './section-headers-cleaner';
import { detectAndFixRecipeStructure } from './recipe-structure-cleaner';
import { fallbackCleanOCRText } from './fallback-cleaner';

export { enhancedExtractRecipeContent } from './content-extractor';
export { fallbackCleanOCRText } from './fallback-cleaner';

/**
 * Enhanced version of the OCR text cleaner with better handling
 * for complex recipe formats and error recovery
 */
export const enhancedCleanOCRText = (text: string): string => {
  if (!text) return '';
  
  logInfo("Cleaning OCR text with enhanced algorithm", { textLength: text.length });
  
  try {
    // Remove excessive whitespace and normalize line breaks
    let cleaned = text.replace(/\r\n/g, '\n');
    
    // Remove multiple consecutive spaces
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
    
    // Remove multiple empty lines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    // Advanced recipe structure detection and correction
    cleaned = detectAndFixRecipeStructure(cleaned);
    
    // Enhanced fraction fixes with more patterns
    cleaned = fixFractions(cleaned);
    
    // Fix measurements with more comprehensive patterns
    cleaned = fixMeasurements(cleaned);
    
    // Fix recipe section headers with better pattern matching
    cleaned = fixSectionHeaders(cleaned);
    
    // Fix common cooking terms with context awareness
    cleaned = fixCookingTerms(cleaned);
    
    logInfo("OCR text cleaned with enhanced algorithm", { 
      originalLength: text.length, 
      cleanedLength: cleaned.length,
      improvement: Math.round((cleaned.length - text.length) / text.length * 100) + '%'
    });
    
    return cleaned.trim();
  } catch (error) {
    // If enhanced cleaning fails, fall back to basic cleaning
    logError("Enhanced OCR cleaning failed, using fallback", { error });
    return fallbackCleanOCRText(text);
  }
};
