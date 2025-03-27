
import { logInfo, logError } from '@/utils/logger';

// Configuration constants
export const MAX_PAGES_TO_PROCESS = 3; // Reduced from 5 to improve performance
export const MAX_PDF_SIZE_MB = 8;
export const PDF_LOAD_TIMEOUT = 12000; // 12 seconds for loading
export const PDF_TOTAL_TIMEOUT = 25000; // 25 seconds total

/**
 * Validate PDF file before processing
 * @param file The PDF file to validate
 * @returns True if validation passed, otherwise throws an error
 */
export const validatePdfFile = (file: File): boolean => {
  // Validate file size
  const maxSize = MAX_PDF_SIZE_MB * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`PDF file is too large (max ${MAX_PDF_SIZE_MB}MB). Try using a smaller file or text input.`);
  }
  
  // Validate file type
  if (!file.type.includes('application/pdf')) {
    throw new Error("Invalid file type. Please upload a valid PDF document.");
  }
  
  logInfo("PDF validation passed", { fileName: file.name, fileSize: file.size });
  return true;
};

/**
 * Calculate the number of pages to process based on the total page count
 * @param totalPages Total number of pages in the PDF
 * @returns Number of pages to process
 */
export const calculatePagesToProcess = (totalPages: number): number => {
  return Math.min(totalPages, MAX_PAGES_TO_PROCESS);
};
