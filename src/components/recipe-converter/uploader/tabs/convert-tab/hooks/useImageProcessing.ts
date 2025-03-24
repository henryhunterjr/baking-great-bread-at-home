
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { extractTextWithOCR } from '@/lib/ai-services/pdf/ocr-processor';
import { logInfo, logError } from '@/utils/logger';

export const useImageProcessing = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const processImage = async (
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
      
      // Progress callback to update UI
      let lastProgress = 0;
      const updateProgress = (progress: number) => {
        if (progress > lastProgress + 5) {
          lastProgress = progress;
          logInfo(`OCR Progress: ${progress}%`);
        }
      };
      
      // Use OCR to extract text from the image
      const extractedText = await extractTextWithOCR(file, updateProgress);
      
      onSuccess(extractedText);
      
      toast({
        title: "Text Extracted",
        description: "Successfully extracted text from your image.",
      });
      
      return null;
    } catch (error) {
      logError('OCR processing error:', error);
      onError(error instanceof Error 
        ? `Failed to extract text: ${error.message}`
        : "Failed to extract text from the image.");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    processImage
  };
};
