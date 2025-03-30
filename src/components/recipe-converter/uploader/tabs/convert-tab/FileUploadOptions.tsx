
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import FileUploadButton from './upload-options/FileUploadButton';
import CameraButton from './upload-options/CameraButton';
import ClipboardButton from './upload-options/ClipboardButton';
import ClearTextButton from './upload-options/ClearTextButton';
import { extractTextWithOCR } from '@/lib/ai-services/pdf/ocr/ocr-processor';

interface FileUploadOptionsProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  isProcessing: boolean;
}

const FileUploadOptions: React.FC<FileUploadOptionsProps> = ({
  recipeText,
  setRecipeText,
  isProcessing
}) => {
  const { toast } = useToast();
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  
  // Handler for processing image files
  const handleFileSelect = async (file: File) => {
    if (isFileProcessing) return;
    
    setIsFileProcessing(true);
    try {
      // Process the file using OCR or other text extraction methods
      const extractedText = await extractTextWithOCR(file);
      
      if (extractedText && typeof extractedText === 'string' && extractedText.trim()) {
        setRecipeText(extractedText);
        toast({
          title: "Text Extracted",
          description: "Text has been extracted from your file",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Extraction Failed",
          description: "Could not extract text from this file",
        });
      }
    } catch (error) {
      console.error("File processing error:", error);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: "Failed to process your file",
      });
    } finally {
      setIsFileProcessing(false);
    }
  };
  
  // Handler for camera capture
  const handleImageCapture = async (file: File) => {
    await handleFileSelect(file);
  };
  
  // Handler for clipboard paste
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText.trim()) {
        setRecipeText(clipboardText);
        toast({
          title: "Text Pasted",
          description: "Text has been pasted from your clipboard",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Empty Clipboard",
          description: "No text found in your clipboard",
        });
      }
    } catch (error) {
      console.error("Clipboard error:", error);
      toast({
        variant: "destructive",
        title: "Clipboard Error",
        description: "Failed to access your clipboard",
      });
    }
  };
  
  // Handler to clear text
  const handleClearText = () => {
    setRecipeText('');
    toast({
      title: "Text Cleared",
      description: "Recipe text has been cleared",
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Upload Options</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <FileUploadButton
          onFileSelect={handleFileSelect}
          isDisabled={isProcessing}
          isProcessing={isFileProcessing}
        />
        <CameraButton
          onImageCapture={handleImageCapture}
          isDisabled={isProcessing || isFileProcessing}
          isProcessing={isFileProcessing}
        />
        <ClipboardButton
          onPasteFromClipboard={handlePasteFromClipboard}
          isDisabled={isProcessing}
          isProcessing={isFileProcessing}
        />
        {recipeText && (
          <ClearTextButton
            onClearText={handleClearText}
            isDisabled={isProcessing}
            isProcessing={isFileProcessing}
          />
        )}
      </div>
    </div>
  );
};

export default FileUploadOptions;
