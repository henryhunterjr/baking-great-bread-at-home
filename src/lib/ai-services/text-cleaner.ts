
/**
 * Centralized text cleaning utilities for OCR and PDF text processing
 */

import { enhancedCleanOCRText, fallbackCleanOCRText } from '@/lib/recipe-conversion/cleaners/index';

/**
 * Clean OCR text with enhanced algorithm and fallback handling
 */
export const cleanOCRText = (text: string): string => {
  try {
    return enhancedCleanOCRText(text);
  } catch (error) {
    // If enhanced cleaning fails, use the fallback cleaner
    console.error('Enhanced OCR cleaning failed, using fallback:', error);
    return fallbackCleanOCRText(text);
  }
};

/**
 * Alias for cleanOCRText specifically for image OCR text
 */
export const cleanImageOCRText = (text: string): string => {
  return cleanOCRText(text);
};

/**
 * Alias for cleanOCRText specifically for PDF text
 */
export const cleanPDFText = (text: string): string => {
  return cleanOCRText(text);
};

/**
 * Basic text normalization function
 */
export const normalizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};
