
import React from 'react';
import ProgressBar from '../file-upload/ProgressBar';
import SelectedFile from '../file-upload/SelectedFile';
import FileUploadError from '../file-upload/FileUploadError';
import FileInput from '../file-upload/FileInput';
import UploadInstructions from '../file-upload/UploadInstructions';
import SupportedFormats from '../file-upload/SupportedFormats';
import { useFileUpload } from '../hooks/useFileUpload';

interface FileUploadTabProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextExtracted: (text: string) => void;
}

const FileUploadTab: React.FC<FileUploadTabProps> = ({ onFileUpload, onTextExtracted }) => {
  const {
    isProcessing,
    progress,
    selectedFileName,
    error,
    processingType,
    handleFileChange,
    handleCancel,
    handleReset,
    fileInputRef
  } = useFileUpload({ onTextExtracted });

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <UploadInstructions />
        
        <FileInput
          onFileSelect={() => fileInputRef.current?.click()}
          onReset={handleReset}
          isProcessing={isProcessing}
          fileInputRef={fileInputRef}
          hasFile={!!selectedFileName}
          hasError={!!error}
          onChange={handleFileChange}
        />
        
        <SelectedFile fileName={selectedFileName} />
        
        <ProgressBar 
          progress={progress} 
          processingType={processingType} 
          onCancel={isProcessing ? handleCancel : undefined}
        />
        
        <FileUploadError error={error} />
      </div>
      
      <SupportedFormats />
    </div>
  );
};

export default FileUploadTab;
