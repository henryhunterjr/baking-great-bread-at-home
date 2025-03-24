
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logInfo, logError } from '@/utils/logger';
import { useFileProcessing } from './useFileProcessing';

interface UseFileUploadProps {
  onTextExtracted: (text: string) => void;
  onError?: (error: string | null) => void;
}

export const useFileUpload = ({ onTextExtracted, onError }: UseFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [processingType, setProcessingType] = useState<'image' | 'pdf' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use our new file processing hook
  const { 
    progress, 
    setProgress, 
    handlePDFFile, 
    handleImageFile, 
    handleTextFile,
    cancelProcessing 
  } = useFileProcessing();
  
  // Helper to set error state and call the error callback
  const setErrorWithCallback = (error: string | null) => {
    setErrorMessage(error);
    if (onError) {
      onError(error);
    }
  };
  
  const resetState = () => {
    // Cancel any ongoing processing
    cancelProcessing();
    
    setIsProcessing(false);
    setProcessingType(null);
    setProgress(0);
    setErrorWithCallback(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleReset = () => {
    resetState();
    setSelectedFileName(null);
  };
  
  const handleCancel = () => {
    if (cancelProcessing()) {
      toast({
        title: "Processing Cancelled",
        description: "File processing has been cancelled.",
      });
    }
    
    resetState();
  };
  
  const readFileAsText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string || "");
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    resetState();
    setSelectedFileName(file.name);
    
    // Process file based on type
    try {
      if (file.type === 'application/pdf') {
        setProcessingType('pdf');
        setIsProcessing(true);
        
        await handlePDFFile({
          file,
          onProgress: setProgress,
          onComplete: onTextExtracted,
          onError: setErrorWithCallback
        });
        
      } else if (file.type.startsWith('image/')) {
        setProcessingType('image');
        setIsProcessing(true);
        
        await handleImageFile({
          file,
          onProgress: setProgress,
          onComplete: onTextExtracted,
          onError: setErrorWithCallback
        });
        
      } else {
        // For text files and other formats
        try {
          // Simple text files don't need complex processing
          if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            const text = await readFileAsText(file);
            if (text) {
              onTextExtracted(text);
              toast({
                title: "File Loaded",
                description: "Text has been successfully loaded from the file.",
              });
            } else {
              setErrorWithCallback("The file appears to be empty. Please try another file.");
            }
          } else {
            // For other file types that might need processing
            setIsProcessing(true);
            
            await handleTextFile({
              file,
              onProgress: setProgress,
              onComplete: onTextExtracted,
              onError: setErrorWithCallback
            });
          }
        } catch (error) {
          logError('Error reading file', { error });
          setErrorWithCallback("Failed to read file. Please try another format.");
        }
      }
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  };

  return {
    isProcessing,
    progress,
    selectedFileName,
    error: errorMessage,
    processingType,
    handleFileChange,
    handleCancel,
    handleReset,
    fileInputRef
  };
};
