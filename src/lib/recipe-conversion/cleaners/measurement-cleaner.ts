
import { logInfo } from '@/utils/logger';

/**
 * Fix measurements with comprehensive pattern matching
 */
export const fixMeasurements = (text: string): string => {
  logInfo('Cleaning measurements in text', { textLength: text.length });
  
  return text
    // Fix standard measurements
    .replace(/(\d+)g(\s|$)/g, '$1g$2')
    .replace(/(\d+)ml(\s|$)/g, '$1ml$2')
    .replace(/(\d+)oz(\s|$)/g, '$1oz$2')
    .replace(/(\d+)lb(\s|$)/g, '$1lb$2')
    .replace(/(\d+)kg(\s|$)/g, '$1kg$2')
    
    // Fix spacing in measurements
    .replace(/(\d+)(tbsp|tsp|cup|oz|g|lb|kg|ml|L)(\s|$)/gi, '$1 $2$3')
    
    // Fix common OCR errors in measurement words
    .replace(/(\d+)\s*cup5/gi, '$1 cups')
    .replace(/(\d+)\s*tb5p/gi, '$1 tbsp')
    .replace(/(\d+)\s*t5p/gi, '$1 tsp')
    .replace(/(\d+)\s*0z/gi, '$1 oz')
    
    // Fix abbreviated measurements
    .replace(/(\d+)\s*c\.\s/gi, '$1 cup ')
    .replace(/(\d+)\s*T\.\s/gi, '$1 tbsp ')
    .replace(/(\d+)\s*t\.\s/gi, '$1 tsp ')
    .replace(/(\d+)\s*oz\.\s/gi, '$1 oz ');
};
