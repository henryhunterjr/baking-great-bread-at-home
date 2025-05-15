
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Clipboard } from 'lucide-react';
import FileUploadButton from './upload-options/FileUploadButton';
import CameraButton from './upload-options/CameraButton';
import ClipboardButton from './upload-options/ClipboardButton';

interface FileUploadOptionsProps {
  recipeText?: string;
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
  const handleFileSelect = async (file: File) => {
    try {
      // A simple demo file reader - in a real app, you'd use OCR or other processing
      const text = await readFileAsText(file);
      setRecipeText(text);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRecipeText(text);
      }
    } catch (error) {
      console.error("Error reading clipboard:", error);
    }
  };

  // Simple file reader function
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <FileUploadButton
          onFileSelect={handleFileSelect}
          isDisabled={isProcessing || uploadDisabled}
          isProcessing={false}
        />
        <CameraButton
          isDisabled={isProcessing || uploadDisabled}
          isProcessing={false}
          onCapture={text => setRecipeText(text)}
        />
        <ClipboardButton
          onPaste={handlePasteFromClipboard}
          isDisabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default FileUploadOptions;
