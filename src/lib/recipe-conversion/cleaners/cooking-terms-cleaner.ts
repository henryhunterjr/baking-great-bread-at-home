
import { logInfo } from '@/utils/logger';

/**
 * Fix common cooking terms with context awareness
 */
export const fixCookingTerms = (text: string): string => {
  logInfo('Cleaning cooking terms in text', { textLength: text.length });
  
  return text
    // Fix common cooking verbs
    .replace(/[Pp]reheat/g, 'Preheat')
    .replace(/[Mm]ix(ing)?/g, (match, p1) => p1 ? 'Mixing' : 'Mix')
    .replace(/[Ss]tir(ring)?/g, (match, p1) => p1 ? 'Stirring' : 'Stir')
    .replace(/[Ww]hisk(ing)?/g, (match, p1) => p1 ? 'Whisking' : 'Whisk')
    .replace(/[Bb]ak(e|ing)/g, (match, p1) => p1 === 'ing' ? 'Baking' : 'Bake')
    
    // Fix common cooking nouns
    .replace(/[Oo]ven/g, 'oven')
    .replace(/[Bb]owl/g, 'bowl')
    .replace(/[Mm]ixture/g, 'mixture')
    .replace(/[Dd]ough/g, 'dough')
    .replace(/[Bb]atter/g, 'batter')
    
    // Fix temperature settings
    .replace(/(\d+)([CF])\./g, '$1°$2.')
    .replace(/(\d+) degrees ([CF])/gi, '$1°$2');
};
