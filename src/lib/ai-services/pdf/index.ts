
// Re-export all PDF processing functionality
export { extractTextFromPDF } from './pdf-extractor';
export type { ExtractTextResult, CancellableTask, ProgressCallback } from './types';
export { processImageWithOCR, extractTextWithOCR, verifyOCRAvailability } from './ocr-processor';
export { cleanPDFText } from './text-cleaner';
export { convertPDFPageToImage } from './pdf-image-converter';
