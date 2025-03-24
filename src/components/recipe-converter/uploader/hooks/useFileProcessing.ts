
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logInfo, logError } from '@/utils/logger';
import { ProcessingTask } from '../file-upload/types';

interface ProcessFileProps {
  file: File;
  onProgress: (progress: number) => void;
  onComplete: (text: string) => void;
  onError: (error: string) => void;
}

export const useFileProcessing = () => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const processingTaskRef = useRef<ProcessingTask | null>(null);
  
  const handlePDFFile = async ({
    file,
    onProgress,
    onComplete,
    onError
  }: ProcessFileProps) => {
    try {
      logInfo('Processing PDF file', { filename: file.name, size: file.size });
      
      // Dynamically import the PDF processor to reduce initial load time
      const { processPDFFile } = await import('../file-upload/pdf-processor');
      
      const processingTask = await processPDFFile(file, {
        onProgress,
        onComplete: (cleanedText) => {
          onComplete(cleanedText);
          toast({
            title: "PDF Processed Successfully",
            description: "We've extracted the recipe text from your PDF.",
          });
        },
        onError: (errorMessage) => {
          logError('PDF processing error', { error: errorMessage });
          onError(errorMessage);
        }
      });
      
      // Store the processing task for potential cancellation
      processingTaskRef.current = processingTask;
      return processingTask;
    } catch (error) {
      logError('Failed to process PDF file', { error });
      onError(error instanceof Error ? error.message : 'Unknown error processing PDF');
      return null;
    }
  };
  
  const handleImageFile = async ({
    file,
    onProgress,
    onComplete,
    onError
  }: ProcessFileProps) => {
    try {
      logInfo('Processing image file', { filename: file.name, size: file.size });
      
      // Dynamically import the image processor to reduce initial load time
      const { processImageFile } = await import('../file-upload/image-processor');
      
      const processingTask = await processImageFile(file, {
        onProgress,
        onComplete: (extractedText) => {
          onComplete(extractedText);
          toast({
            title: "Image Processed Successfully",
            description: "We've extracted the recipe text from your image.",
          });
        },
        onError: (errorMessage) => {
          logError('Image processing error', { error: errorMessage });
          onError(errorMessage);
        }
      });
      
      // Store the processing task for potential cancellation
      processingTaskRef.current = processingTask;
      return processingTask;
    } catch (error) {
      logError('Failed to process image file', { error });
      onError(error instanceof Error ? error.message : 'Unknown error processing image');
      return null;
    }
  };
  
  const handleTextFile = async ({
    file,
    onProgress,
    onComplete,
    onError
  }: ProcessFileProps) => {
    try {
      logInfo('Processing text file', { filename: file.name, size: file.size });
      
      // Dynamically import the text processor to reduce initial load time
      const { processTextFile } = await import('../file-upload/text-processor');
      
      const processingTask = await processTextFile(file, {
        onProgress,
        onComplete,
        onError: (errorMessage) => {
          logError('Text processing error', { error: errorMessage });
          onError(errorMessage);
        }
      });
      
      // Store the processing task for potential cancellation
      processingTaskRef.current = processingTask;
      return processingTask;
    } catch (error) {
      logError('Failed to process text file', { error });
      onError(error instanceof Error ? error.message : 'Unknown error processing text file');
      return null;
    }
  };
  
  const cancelProcessing = () => {
    if (processingTaskRef.current?.cancel) {
      processingTaskRef.current.cancel();
      processingTaskRef.current = null;
      logInfo('File processing cancelled', {});
      return true;
    }
    return false;
  };
  
  return {
    progress,
    setProgress,
    handlePDFFile,
    handleImageFile,
    handleTextFile,
    cancelProcessing
  };
};
