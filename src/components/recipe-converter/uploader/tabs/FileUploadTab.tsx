
import React from 'react';
import { useFileUpload } from '../hooks/useFileUpload';
import FileUploadInitial from './file-upload/FileUploadInitial';
import FileUploadProcessing from './file-upload/FileUploadProcessing';

interface FileUploadTabProps {
  onTextExtracted: (text: string) => void;
  setError: (error: string | null) => void;
}

const FileUploadTab: React.FC<FileUploadTabProps> = ({
  onTextExtracted,
  setError
}) => {
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
  } = useFileUpload({
    onTextExtracted,
    onError: setError
  });
  
  // Function to switch to text input tab
  const handleSwitchToTextInput = () => {
    const textTabButton = document.querySelector('button[value="text"]');
    if (textTabButton) {
      (textTabButton as HTMLButtonElement).click();
    }
  };
  
  // Determine if the file is a Word document
  const isWordDocument = selectedFileName && (
    selectedFileName.endsWith('.doc') || 
    selectedFileName.endsWith('.docx') || 
    selectedFileName.includes('word')
  );
  
  return (
    <div className="space-y-6">
      {!selectedFileName ? (
        <FileUploadInitial
          onSelectFile={handleFileChange}
          fileInputRef={fileInputRef}
        />
      ) : (
        <FileUploadProcessing
          fileName={selectedFileName}
          isProcessing={isProcessing}
          progress={progress}
          error={error}
          processingType={processingType}
          onReset={handleReset}
          onSwitchToTextInput={handleSwitchToTextInput}
          onCancel={handleCancel}
          isWordDocument={isWordDocument}
        />
      )}
    </div>
  );
};

export default FileUploadTab;
