
/**
 * Fix common OCR errors with fractions
 */
export const fixFractions = (text: string): string => {
  if (!text) return '';
  
  // Replace common OCR fraction errors
  return text
    // Fix digit-slash-digit patterns
    .replace(/(\d+)\/(\d+)/g, '$1/$2')
    // Fix l/2 with 1/2
    .replace(/l\/2/g, '1/2')
    .replace(/l\/4/g, '1/4')
    .replace(/l\/3/g, '1/3')
    // Fix O with 0
    .replace(/(\d+)O/g, '$10')
    .replace(/O(\d+)/g, '0$1')
    // Fix common unicode fraction characters
    .replace(/½/g, '1/2')
    .replace(/¼/g, '1/4')
    .replace(/¾/g, '3/4')
    .replace(/⅓/g, '1/3')
    .replace(/⅔/g, '2/3')
    // Fix spacing issues around fractions
    .replace(/(\d+) (\d+)\/(\d+)/g, '$1 $2/$3')
    .replace(/(\d+)(\d+)\/(\d+)/g, '$1 $2/$3');
};
