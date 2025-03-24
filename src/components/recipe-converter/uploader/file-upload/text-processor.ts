
import { logError } from '@/utils/logger';
import { ProcessingCallbacks, ProcessingTask } from './types';

/**
 * Process a text file
 */
export const processTextFile = async (
  file: File,
  callbacks: ProcessingCallbacks
): Promise<ProcessingTask> => {
  const { onProgress, onComplete, onError } = callbacks;
  let isCancelled = false;
  
  try {
    // Start progress
    onProgress(20);
    
    const reader = new FileReader();
    
    const readPromise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        if (isCancelled) return;
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Failed to read file content"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 80) + 20;
          onProgress(progress);
        }
      };
      
      reader.readAsText(file);
    });
    
    // Add timeout protection
    const textContent = await Promise.race([
      readPromise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('File reading timed out')), 30000)
      )
    ]);
    
    if (isCancelled) return null;
    
    // Complete progress
    onProgress(100);
    
    // Call the completion callback
    onComplete(textContent);
    
    return {
      cancel: () => {
        isCancelled = true;
        reader.abort();
      }
    };
  } catch (error) {
    if (!isCancelled) {
      logError('Text file processing error:', { error });
      onError(`Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    return null;
  }
};
