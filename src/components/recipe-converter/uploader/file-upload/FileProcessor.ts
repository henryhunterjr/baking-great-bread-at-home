
import { logInfo } from '@/utils/logger';
import { processImageFile } from './image-processor';
import { processPDFFile } from './pdf-processor';
import { processTextFile } from './text-processor';
import { ProcessingCallbacks, ProcessingTask } from './types';

/**
 * Process an image file with OCR
 */
export { processImageFile } from './image-processor';

/**
 * Process a PDF file
 */
export { processPDFFile } from './pdf-processor';

/**
 * Process a text file
 */
export { processTextFile } from './text-processor';

/**
 * Automatically detect file type and process accordingly
 */
export const processFile = async (
  file: File,
  callbacks: ProcessingCallbacks
): Promise<ProcessingTask> => {
  const fileType = file.type.toLowerCase();
  logInfo(`Processing file: ${file.name} (${fileType})`);
  
  // Handle image files
  if (fileType.startsWith('image/')) {
    return processImageFile(file, callbacks);
  }
  
  // Handle PDF files
  if (fileType === 'application/pdf') {
    return processPDFFile(file, callbacks);
  }
  
  // Handle text files
  if (fileType === 'text/plain' || 
      fileType === 'text/html' || 
      fileType === 'text/markdown' ||
      fileType === 'application/msword' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.txt') || 
      file.name.endsWith('.md')) {
    return processTextFile(file, callbacks);
  }
  
  // For unsupported file types
  callbacks.onError(`Unsupported file type: ${fileType}. Please try a different file format.`);
  return null;
};
