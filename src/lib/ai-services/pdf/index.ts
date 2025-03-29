
// Export all PDF processing functionality from this index file
export { extractTextFromPDF } from './pdf-extractor';
export { extractTextWithOCR } from './ocr/ocr-processor';
export { cleanupOCR } from './ocr/ocr-service';
export { calculateTimeout } from './ocr/ocr-utils';

// Re-export the OCR fallback
export { attemptOCRFallback } from './ocr-fallback';

// Re-export types
export type { ProgressCallback, CancellableTask } from './types';
export { ProcessingErrorType, ProcessingError } from './types';
