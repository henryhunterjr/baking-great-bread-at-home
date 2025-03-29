
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { extractTextWithOCR } from '@/lib/ai-services/pdf/ocr/ocr-processor';
import { logInfo, logError } from '@/utils/logger';

// Extract the processImage function for direct import
export const processImage = async (
  file: File,
  onSuccess: (text: string) => void,
  onError: (error: string) => void
): Promise<{ cancel: () => void } | null> => {
  try {
    let lastProgress = 0;
    const updateProgress = (progress: number) => {
      if (progress > lastProgress + 5) {
        lastProgress = progress;
        logInfo(`OCR Progress: ${progress}%`);
      }
    };
    
    // Use OCR to extract text from the image
    const extractedText = await extractTextWithOCR(file, updateProgress);
    
    // Check if we got a valid result
    if (!extractedText || (typeof extractedText === 'string' && extractedText.trim().length === 0)) {
      onError("No text could be extracted from this image. Please try a clearer image or enter text manually.");
      return null;
    }
    
    // Handle strings or objects with cancel methods
    if (typeof extractedText === 'string') {
      onSuccess(extractedText);
      return null;
    } else if (typeof extractedText === 'object' && 'cancel' in extractedText) {
      // Return the cancelable task
      return extractedText as { cancel: () => void };
    }
    
    // Fallback for unexpected result types
    onError("Unexpected result from OCR processing. Please try again.");
    return null;
  } catch (error) {
    logError('OCR processing error:', { error });
    onError(error instanceof Error 
      ? `Failed to extract text: ${error.message}`
      : "Failed to extract text from the image.");
    return null;
  }
};

export const useImageProcessing = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleImageProcessing = async (
    file: File,
    onSuccess: (text: string) => void,
    onError: (error: string) => void
  ): Promise<{ cancel: () => void } | null> => {
    try {
      setIsProcessing(true);
      
      toast({
        title: "Processing Image",
        description: "Extracting text from your image with OCR...",
      });
      
      const result = await processImage(file, onSuccess, onError);
      
      toast({
        title: "Text Extracted",
        description: "Successfully extracted text from your image.",
      });
      
      return result;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    processImage: handleImageProcessing
  };
};
