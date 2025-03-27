
import { logError, logInfo } from '@/utils/logger';

// Constants
export const MAX_PDF_SIZE_MB = 20; // Increased from 15MB to 20MB
export const MAX_PAGES_TO_PROCESS = 20; // Limit number of pages for performance
export const PDF_LOAD_TIMEOUT = 60000; // 60 seconds for initial PDF loading
export const PDF_TOTAL_TIMEOUT = 180000; // 3 minutes total processing time

/**
 * Validate PDF file size and type
 * @param file PDF file to validate
 * @throws Error if file is invalid
 */
export const validatePdfFile = (file: File): void => {
  // Check file size
  const maxSize = MAX_PDF_SIZE_MB * 1024 * 1024;
  if (file.size > maxSize) {
    logError('PDF file size exceeds limit', { 
      fileSize: file.size, 
      maxSize,
      fileName: file.name 
    });
    throw new Error(`PDF file is too large (max ${MAX_PDF_SIZE_MB}MB). Please upload a smaller file.`);
  }
  
  // Check file type (more lenient)
  const fileType = file.type.toLowerCase();
  if (!fileType.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
    logError('Invalid PDF file type', { 
      fileType: file.type,
      fileName: file.name
    });
    throw new Error('Invalid file type. Please upload a valid PDF document.');
  }
  
  logInfo('PDF file validated successfully', { 
    fileSize: file.size, 
    fileType: file.type,
    fileName: file.name
  });
};

/**
 * Calculate how many pages to process based on the total number
 * @param totalPages Total number of pages in the PDF
 * @returns Number of pages to process
 */
export const calculatePagesToProcess = (totalPages: number): number => {
  const pagesToProcess = Math.min(totalPages, MAX_PAGES_TO_PROCESS);
  
  if (totalPages > MAX_PAGES_TO_PROCESS) {
    logInfo('Limiting PDF processing to first pages', { 
      totalPages, 
      pagesToProcess: MAX_PAGES_TO_PROCESS 
    });
  }
  
  return pagesToProcess;
};
