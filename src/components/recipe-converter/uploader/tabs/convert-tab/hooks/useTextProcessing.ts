
import { logInfo, logError } from '@/utils/logger';

// Process a text file and return the contents
export const processTextFile = async (
  file: File,
  onSuccess: (text: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    logInfo('Processing text file', { filename: file.name, fileSize: file.size });
    
    const reader = new FileReader();
    
    // Create a promise to handle the file reading
    const textContent = await new Promise<string>((resolve, reject) => {
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file content"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      
      reader.readAsText(file);
    });
    
    logInfo('Text file processed successfully', { contentLength: textContent.length });
    
    // Call the success callback with the text content
    onSuccess(textContent);
  } catch (error) {
    logError('Text file processing error', { error });
    onError(error instanceof Error ? error.message : 'Unknown error');
  }
};
