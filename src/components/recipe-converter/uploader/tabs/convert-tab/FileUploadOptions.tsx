
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import FileUploadButton from './upload-options/FileUploadButton';
import CameraButton from './upload-options/CameraButton';
import ClipboardButton from './upload-options/ClipboardButton';
import ClearTextButton from './upload-options/ClearTextButton';
import { extractTextWithOCR } from '@/lib/ai-services/pdf/ocr/ocr-processor';
import { Ban } from 'lucide-react';

interface FileUploadOptionsProps {
  recipeText: string;
  setRecipeText: (text: string) => void;
  isProcessing: boolean;
  uploadDisabled?: boolean;
}

const FileUploadOptions: React.FC<FileUploadOptionsProps> = ({
  recipeText,
  setRecipeText,
  isProcessing,
  uploadDisabled = false
}) => {
  const { toast } = useToast();
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  
  // Handler for processing image files
  const handleFileSelect = async (file: File) => {
    if (isFileProcessing || uploadDisabled) return;
    
    if (uploadDisabled) {
      toast({
        variant: "destructive",
        title: "Uploads Disabled",
        description: "File uploads are temporarily disabled in this preview version.",
      });
      return;
    }
    
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
    if (uploadDisabled) {
      toast({
        variant: "destructive",
        title: "Uploads Disabled",
        description: "Camera uploads are temporarily disabled in this preview version.",
      });
      return;
    }
    
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
      
      {uploadDisabled && (
        <div className="flex items-center px-3 py-2 bg-red-50 border border-red-200 rounded-md mb-2">
          <Ban className="h-4 w-4 text-red-600 mr-2" />
          <p className="text-xs text-red-700">
            File and camera uploads are disabled in this preview version.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <FileUploadButton
          onFileSelect={handleFileSelect}
          isDisabled={isProcessing || uploadDisabled}
          isProcessing={isFileProcessing}
        />
        <CameraButton
          onImageCapture={handleImageCapture}
          isDisabled={isProcessing || isFileProcessing || uploadDisabled}
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
