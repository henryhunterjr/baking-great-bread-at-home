
import { logError, logInfo } from '@/utils/logger';
import { ProcessingCallbacks, ProcessingTask } from './types';
import { cleanOCRText } from '@/lib/ai-services/text-cleaner';

/**
 * Process a text file to extract and clean its contents
 */
export const processTextFile = async (
  file: File,
  callbacks: ProcessingCallbacks
): Promise<ProcessingTask> => {
  const { onProgress, onComplete, onError } = callbacks;
  
  try {
    logInfo('Processing text file', { filename: file.name, filesize: file.size });
    
    // Check if file too large (> 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('Text file is too large (max 10MB). Please try a smaller file or extract just the recipe section.');
      return null;
    }
    
    // Show initial progress
    onProgress(20);
    
    // Determine how to process the file based on its type
    const fileType = file.type.toLowerCase();
    
    // Handle specific file types
    // Word documents can have different mime types
    const isWordDocument = 
      fileType.includes('word') || 
      fileType.includes('document') || 
      fileType.includes('msword') || 
      fileType.includes('openxml') ||
      file.name.endsWith('.doc') || 
      file.name.endsWith('.docx');
    
    if (isWordDocument) {
      logInfo('Detected Word document, using specialized processing', { fileType });
      
      // For Word docs, we need to explicitly inform the user these can't be processed directly
      onError('Word documents (.doc/.docx) cannot be processed directly. Please copy the recipe text from the document and paste it in the text input area.');
      onProgress(100);
      return null;
    }
    
    // For plain text files, read the content directly
    const reader = new FileReader();
    
    // Create a promise to handle FileReader async operation
    const readFilePromise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        // FileReader result could be string, ArrayBuffer, etc. - ensure we have a string
        const content = typeof reader.result === 'string' 
          ? reader.result 
          : new TextDecoder().decode(reader.result as ArrayBuffer);
        
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read the file. Please try again.'));
      };
    });
    
    // Read file content
    onProgress(30);
    reader.readAsText(file);
    
    // Await file reading completion
    const content = await readFilePromise;
    onProgress(70);
    
    // Check if content is empty or too short
    if (!content || content.trim().length === 0) {
      onError('The file appears to be empty. Please try another file.');
      return null;
    }
    
    // If content looks like binary/non-text data (contains lots of unusual characters)
    const nonTextPattern = /[\x00-\x08\x0B\x0C\x0E-\x1F\x80-\xFF]/g;
    const nonTextMatches = (content.substring(0, 1000).match(nonTextPattern) || []).length;
    const nonTextRatio = nonTextMatches / Math.min(content.length, 1000);
    
    if (nonTextRatio > 0.3) { // If more than 30% of characters look like binary data
      logError('File appears to contain binary or non-text data', { 
        ratio: nonTextRatio, 
        fileType: file.type 
      });
      onError('This file appears to contain binary or non-text data. Please use a plain text file or paste the recipe text directly.');
      return null;
    }
    
    // Clean up the text to remove unwanted characters and improve formatting
    const cleanedText = cleanOCRText(content);
    onProgress(100);
    
    // Deliver the extracted content
    onComplete(cleanedText);
    return null;
  } catch (err) {
    logError('Text file processing error:', { error: err });
    onError(err instanceof Error ? err.message : 'Failed to process text file.');
    return null;
  }
};
