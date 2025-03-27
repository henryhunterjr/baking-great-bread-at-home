
// This file is now a re-export layer for backward compatibility
import { verifyOCRAvailability, processImageWithOCR, extractTextWithOCR } from './ocr/ocr-processor';
import { cleanupOCR } from './ocr/ocr-service';

// Re-export everything for backward compatibility
export {
  verifyOCRAvailability,
  processImageWithOCR,
  extractTextWithOCR,
  cleanupOCR
};
