
// This file is now a re-export layer for backward compatibility
import { verifyOCRAvailability, extractTextWithOCR } from './ocr/ocr-processor';
import { cleanupOCR } from './ocr/ocr-service';

// Re-export everything for backward compatibility
export {
  verifyOCRAvailability,
  extractTextWithOCR,
  cleanupOCR
};

// Export this alias to maintain API compatibility with old code
// This function doesn't exist in the new module structure
export const processImageWithOCR = extractTextWithOCR;

