
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromPDF } from '@/lib/ai-services/pdf/pdf-extractor';
import { logInfo, logError } from '@/utils/logger';

export const usePDFProcessing = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const processPDF = async (
    file: File,
    onSuccess: (text: string) => void,
    onError: (error: string) => void
  ): Promise<{ cancel: () => void } | null> => {
    try {
      setIsProcessing(true);
      
      toast({
        title: "Processing PDF",
        description: "Extracting text from your PDF...",
      });
      
      // Progress callback to update UI with throttling
      let lastToastProgress = 0;
      const updateProgress = (progress: number) => {
        // Only update toast if progress has increased by at least 10%
        if (progress > lastToastProgress + 10) {
          lastToastProgress = progress;
          
          // Update toast message based on progress
          let message = "Extracting text from PDF...";
          if (progress > 90) {
            message = "Finalizing text extraction...";
          } else if (progress > 50) {
            message = "Analyzing PDF content...";
          } else if (progress > 20) {
            message = "Processing PDF pages...";
          }
          
          toast({
            title: `Processing PDF: ${progress}%`,
            description: message,
          });
          
          logInfo(`PDF Progress: ${progress}%`);
        }
      };
      
      // Extract text from PDF
      const extractResult = await extractTextFromPDF(file, updateProgress);
      
      // Check if the result is a cancellable task object or null
      if (extractResult === null) {
        logInfo("PDF extraction returned null");
        onError("Failed to extract text from the PDF. The file may be empty or corrupted.");
        return null;
      }
      
      // Check if the result is a cancellable task object
      if (typeof extractResult === 'object' && extractResult !== null && 'cancel' in extractResult) {
        return extractResult as { cancel: () => void };
      }
      
      // If we got text back, use it - with proper null handling
      const extractedText = typeof extractResult === 'string' ? extractResult : '';
      onSuccess(extractedText);
      
      toast({
        title: "Text Extracted",
        description: "Successfully extracted text from your PDF.",
      });
      
      return null;
    } catch (error) {
      logError('PDF processing error:', error);
      onError(error instanceof Error 
        ? `Failed to extract text: ${error.message}`
        : "Failed to extract text from the PDF.");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    processPDF
  };
};
