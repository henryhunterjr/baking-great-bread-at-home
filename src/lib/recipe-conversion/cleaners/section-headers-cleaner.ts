
import { logInfo } from '@/utils/logger';

/**
 * Fix recipe section headers with better pattern matching
 */
export const fixSectionHeaders = (text: string): string => {
  logInfo('Cleaning section headers in text', { textLength: text.length });
  
  return text
    // Fix common recipe section headers
    .replace(/lngredients/gi, 'Ingredients')
    .replace(/D1rections/gi, 'Directions')
    .replace(/[Ii]nstructions?:/g, 'Instructions:')
    .replace(/[Pp]rep(aration)?:/g, 'Preparation:')
    .replace(/[Mm]ethod:/g, 'Method:')
    .replace(/[Ss]tep (\d+)[:\.]?/g, 'Step $1:')
    
    // Ensure section headers are properly formatted with newlines
    .replace(/([a-z])(\n|.)(INGREDIENTS|DIRECTIONS|INSTRUCTIONS|METHOD)/gi, '$1\n\n$3')
    
    // Enhance section header detection
    .replace(/(^|\n)([A-Z][A-Z\s]+:?)($|\n)/g, '$1\n$2\n$3');
};
