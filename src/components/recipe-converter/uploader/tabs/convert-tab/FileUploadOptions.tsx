
import React from 'react';
import FileUploadButton from './upload-options/FileUploadButton';
import CameraButton from './upload-options/CameraButton';
import ClipboardButton from './upload-options/ClipboardButton';
import ClearTextButton from './upload-options/ClearTextButton';
import { useFileHandlers } from './hooks/useFileHandlers';

interface FileUploadOptionsProps {
  setRecipeText: (text: string) => void;
  isConverting: boolean;
  onError?: (error: string | null) => void;
}

const FileUploadOptions: React.FC<FileUploadOptionsProps> = ({
  setRecipeText,
  isConverting,
  onError
}) => {
  const { 
    isProcessing, 
    handleFileSelect, 
    handlePasteFromClipboard, 
    clearText,
    cancelProcessing
  } = useFileHandlers({ 
    setRecipeText,
    onError: (error) => {
      if (onError) onError(error);
    }
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <FileUploadButton
        onFileSelect={handleFileSelect}
        isDisabled={isConverting}
        isProcessing={isProcessing}
        onCancel={cancelProcessing}
      />
      
      <CameraButton
        isDisabled={isConverting || isProcessing}
        onCapture={handleFileSelect}
      />
      
      <ClipboardButton
        onPaste={handlePasteFromClipboard}
        isDisabled={isConverting || isProcessing}
      />
      
      <ClearTextButton
        onClear={clearText}
        isDisabled={isConverting || isProcessing}
      />
    </div>
  );
};

export default FileUploadOptions;
