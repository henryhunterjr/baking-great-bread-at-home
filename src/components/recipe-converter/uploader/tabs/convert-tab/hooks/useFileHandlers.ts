
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { extractTextWithOCR } from '@/lib/ai-services/pdf/ocr-processor';
import { extractTextFromPDF } from '@/lib/ai-services/pdf/pdf-extractor';

interface UseFileHandlersProps {
  setRecipeText: (text: string) => void;
}

export const useFileHandlers = ({ setRecipeText }: UseFileHandlersProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Track any ongoing processing task to allow cancellation
  const processingTask = useRef<{ cancel?: () => void } | null>(null);

  const cancelCurrentProcessing = () => {
    if (processingTask.current?.cancel) {
      processingTask.current.cancel();
      processingTask.current = null;
    }
  };

  const handleImageFile = async (file: File): Promise<void> => {
    try {
      // Cancel any ongoing processing
      cancelCurrentProcessing();
      
      setIsProcessing(true);
      
      toast({
        title: "Processing Image",
        description: "Extracting text from your image...",
      });
      
      // Progress callback to update UI
      let lastProgress = 0;
      const updateProgress = (progress: number) => {
        if (progress > lastProgress + 5) {
          lastProgress = progress;
          toast({
            title: "Processing Image",
            description: `Extracting text: ${progress}% complete`,
          });
        }
      };
      
      // Use OCR to extract text from the image
      const extractedText = await extractTextWithOCR(file, updateProgress);
      
      setRecipeText(extractedText);
      
      toast({
        title: "Text Extracted",
        description: "Successfully extracted text from your image.",
      });
    } catch (error) {
      console.error('OCR processing error:', error);
      toast({
        variant: "destructive",
        title: "OCR Error",
        description: error instanceof Error 
          ? `Failed to extract text: ${error.message}`
          : "Failed to extract text from the image.",
      });
      throw error;
    } finally {
      setIsProcessing(false);
      processingTask.current = null;
    }
  };
  
  const handlePDFFile = async (file: File): Promise<void> => {
    try {
      // Cancel any ongoing processing
      cancelCurrentProcessing();
      
      setIsProcessing(true);
      
      toast({
        title: "Processing PDF",
        description: "Extracting text from your PDF...",
      });
      
      // Progress callback to update UI
      let lastToastProgress = 0;
      const updateProgress = (progress: number) => {
        if (progress > lastToastProgress + 10) {
          lastToastProgress = progress;
          toast({
            title: "Processing PDF",
            description: `Extracting text: ${progress}% complete`,
          });
        }
      };
      
      // Extract text from PDF
      const extractedText = await extractTextFromPDF(file, updateProgress);
      
      setRecipeText(extractedText);
      
      toast({
        title: "Text Extracted",
        description: "Successfully extracted text from your PDF.",
      });
    } catch (error) {
      console.error('PDF processing error:', error);
      toast({
        variant: "destructive",
        title: "PDF Error",
        description: error instanceof Error 
          ? `Failed to extract text: ${error.message}`
          : "Failed to extract text from the PDF.",
      });
      throw error;
    } finally {
      setIsProcessing(false);
      processingTask.current = null;
    }
  };
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string || "");
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  
  const handleFileSelect = async (file: File): Promise<void> => {
    try {
      setIsProcessing(true);
      
      if (file.type.includes('image/')) {
        await handleImageFile(file);
      } else if (file.type.includes('application/pdf')) {
        await handlePDFFile(file);
      } else {
        // Handle text files and other formats
        const text = await readFileAsText(file);
        setRecipeText(text || "");
        
        toast({
          title: "File Loaded",
          description: "Text has been successfully loaded from the file.",
        });
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: error instanceof Error 
          ? error.message
          : "Failed to process the file. Please try another file or format.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePasteFromClipboard = async (): Promise<void> => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      
      if (clipboardText) {
        setRecipeText(clipboardText);
        
        toast({
          title: "Text Pasted",
          description: "Recipe text pasted from clipboard.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Clipboard Empty",
          description: "No text found in clipboard. Try copying some text first.",
        });
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      toast({
        variant: "destructive",
        title: "Clipboard Error",
        description: "Unable to access clipboard. Please paste the text manually.",
      });
    }
  };
  
  const clearText = (): void => {
    setRecipeText('');
    toast({
      title: "Text Cleared",
      description: "Recipe text has been cleared.",
    });
  };

  return {
    isProcessing,
    handleFileSelect,
    handlePasteFromClipboard,
    clearText,
    cancelCurrentProcessing
  };
};
