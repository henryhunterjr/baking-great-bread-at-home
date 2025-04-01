
import { logInfo } from '@/utils/logger';

/**
 * Fix fractions with comprehensive pattern matching
 */
export const fixFractions = (text: string): string => {
  logInfo('Cleaning fractions in text', { textLength: text.length });
  
  return text
    // Fix common OCR fraction errors
    .replace(/l\/2/g, '1/2')
    .replace(/l\/4/g, '1/4')
    .replace(/l\/3/g, '1/3')
    .replace(/l\/8/g, '1/8')
    .replace(/3\/4/g, '3/4')
    .replace(/2\/3/g, '2/3')
    .replace(/(\d)l(\s|$)/g, '$1l$2')
    .replace(/(\d),(\d)/g, '$1.$2')
    
    // Fix spacing around fractions
    .replace(/(\d+)\/(\d+)/g, '$1/$2')
    .replace(/(\d+) (\d+)\/(\d+)/g, '$1 $2/$3')
    
    // Fix Unicode fractions that OCR sometimes produces
    .replace(/½/g, '1/2')
    .replace(/⅓/g, '1/3')
    .replace(/⅔/g, '2/3')
    .replace(/¼/g, '1/4')
    .replace(/¾/g, '3/4')
    .replace(/⅕/g, '1/5')
    .replace(/⅖/g, '2/5')
    .replace(/⅗/g, '3/5')
    .replace(/⅘/g, '4/5')
    .replace(/⅙/g, '1/6')
    .replace(/⅚/g, '5/6')
    .replace(/⅛/g, '1/8')
    .replace(/⅜/g, '3/8')
    .replace(/⅝/g, '5/8')
    .replace(/⅞/g, '7/8');
};
