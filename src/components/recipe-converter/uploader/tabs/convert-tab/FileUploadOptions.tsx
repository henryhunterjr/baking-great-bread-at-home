
import React from 'react';
import FileUploadButton from './upload-options/FileUploadButton';
import CameraButton from './upload-options/CameraButton';
import ClipboardButton from './upload-options/ClipboardButton';
import ClearTextButton from './upload-options/ClearTextButton';
import { useFileHandlers } from './hooks/useFileHandlers';

interface FileUploadOptionsProps {
  setRecipeText: (text: string) => void;
  isConverting: boolean;
}

const FileUploadOptions: React.FC<FileUploadOptionsProps> = ({ 
  setRecipeText, 
  isConverting 
}) => {
  const {
    isProcessing,
    handleFileSelect,
    handlePasteFromClipboard,
    clearText
  } = useFileHandlers({ setRecipeText });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      <FileUploadButton 
        onFileSelect={handleFileSelect}
        isDisabled={isConverting}
        isProcessing={isProcessing}
      />
      
      <CameraButton 
        onImageCapture={handleFileSelect}
        isDisabled={isConverting}
        isProcessing={isProcessing}
      />
      
      <ClipboardButton 
        onPasteFromClipboard={handlePasteFromClipboard}
        isDisabled={isConverting}
        isProcessing={isProcessing}
      />
      
      <ClearTextButton 
        onClearText={clearText}
        isDisabled={isConverting}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default FileUploadOptions;
