
import { useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { processFile, processImageFile, processPDFFile } from '../file-upload/FileProcessor';
import { ProcessingTask } from '../file-upload/types';

interface UseFileUploadResult {
  isProcessing: boolean;
  progress: number;
  selectedFileName: string | null;
  error: string | null;
  processingType: 'image' | 'pdf' | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleCancel: () => void;
  handleReset: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

interface UseFileUploadProps {
  onTextExtracted: (text: string) => void;
}

export const useFileUpload = ({ onTextExtracted }: UseFileUploadProps): UseFileUploadResult => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingType, setProcessingType] = useState<'image' | 'pdf' | null>(null);
  const { toast } = useToast();
  
  // Add cancel handler reference
  const cancelHandlerRef = useRef<ProcessingTask>(null);
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string || "");
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  
  const resetState = () => {
    // Cancel any ongoing processing
    if (cancelHandlerRef.current) {
      cancelHandlerRef.current.cancel();
      cancelHandlerRef.current = null;
    }
    
    setIsProcessing(false);
    setProcessingType(null);
    setProgress(0);
    setError(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleCancel = () => {
    // Cancel any ongoing processing
    if (cancelHandlerRef.current) {
      cancelHandlerRef.current.cancel();
      cancelHandlerRef.current = null;
    }
    
    toast({
      title: "Processing Cancelled",
      description: "File processing has been cancelled.",
    });
    
    resetState();
  };
  
  const handleReset = () => {
    handleCancel();
    setSelectedFileName(null);
  };
  
  const handlePDFFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingType('pdf');
    setProgress(0);
    
    const processingTask = await processPDFFile(
      file,
      {
        onProgress: (progressValue) => setProgress(progressValue),
        onComplete: (cleanedText) => {
          onTextExtracted(cleanedText);
          toast({
            title: "PDF Processed Successfully",
            description: "We've extracted the recipe text from your PDF.",
          });
          setIsProcessing(false);
          setProcessingType(null);
          cancelHandlerRef.current = null;
        },
        onError: (errorMessage) => {
          setError(errorMessage);
          setIsProcessing(false);
          setProcessingType(null);
          cancelHandlerRef.current = null;
        }
      }
    );
    
    // Store the cancel handler
    cancelHandlerRef.current = processingTask;
  };
  
  const handleImageFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingType('image');
    setProgress(0);
    
    const processingTask = await processImageFile(
      file,
      {
        onProgress: (progressValue) => setProgress(progressValue),
        onComplete: (extractedText) => {
          onTextExtracted(extractedText);
          toast({
            title: "Image Processed Successfully",
            description: "We've extracted the recipe text from your image.",
          });
          setIsProcessing(false);
          setProcessingType(null);
          cancelHandlerRef.current = null;
        },
        onError: (errorMessage) => {
          setError(errorMessage);
          setIsProcessing(false);
          setProcessingType(null);
          cancelHandlerRef.current = null;
        }
      }
    );
    
    // Store the cancel handler
    cancelHandlerRef.current = processingTask;
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    resetState();
    setSelectedFileName(file.name);
    
    // Check file type
    if (file.type === 'application/pdf') {
      // Handle PDF file
      await handlePDFFile(file);
    } else if (file.type.startsWith('image/')) {
      // Handle image file with OCR
      await handleImageFile(file);
    } else {
      // For other file types (text, etc.), use the existing handler
      try {
        const text = await readFileAsText(file);
        onTextExtracted(text);
      } catch (error) {
        setError("Failed to read file. Please try another format.");
        console.error("File reading error:", error);
      }
    }
  };

  return {
    isProcessing,
    progress,
    selectedFileName,
    error,
    processingType,
    handleFileChange,
    handleCancel,
    handleReset,
    fileInputRef
  };
};
