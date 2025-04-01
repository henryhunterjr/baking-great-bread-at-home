
import { ProcessingError, ProcessingErrorType } from '../../types';

/**
 * Helper function to read a file as ArrayBuffer with timeout
 */
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result instanceof ArrayBuffer) {
        resolve(event.target.result);
      } else {
        reject(new ProcessingError(
          'Failed to read PDF file as ArrayBuffer',
          ProcessingErrorType.FILE_LOAD
        ));
      }
    };
    
    reader.onerror = () => {
      reject(new ProcessingError(
        'Error reading PDF file',
        ProcessingErrorType.FILE_LOAD
      ));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
