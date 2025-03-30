
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
  const fileName = file.name.toLowerCase();
  logInfo(`Processing file: ${file.name} (${fileType})`);
  
  // Handle image files
  if (fileType.startsWith('image/')) {
    return processImageFile(file, callbacks);
  }
  
  // Handle PDF files
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return processPDFFile(file, callbacks);
  }
  
  // Handle Word documents with a clear error message
  if (fileType.includes('word') || 
      fileType.includes('msword') || 
      fileType.includes('openxmlformats-officedocument.wordprocessingml') ||
      fileName.endsWith('.doc') || 
      fileName.endsWith('.docx')) {
    callbacks.onError(
      "Word documents (.doc/.docx) are not supported for direct processing. " +
      "Please save as PDF first or copy the text from your Word document and paste it into the text input tab."
    );
    return null;
  }
  
  // Handle text files
  if (fileType === 'text/plain' || 
      fileType === 'text/html' || 
      fileType === 'text/markdown' ||
      fileName.endsWith('.txt') || 
      fileName.endsWith('.md')) {
    return processTextFile(file, callbacks);
  }
  
  // For unsupported file types
  callbacks.onError(`Unsupported file type: ${fileType}. We currently support PDF, images (.jpg, .png), and plain text files only.`);
  return null;
};
