
import React from 'react';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '../hooks/useFileUpload';
import UploadProgress from '../file-upload/UploadProgress';
import { RefreshCw, ArrowRight, FileText } from 'lucide-react';
import FileUploadError from '../FileProcessingError';
import SupportedFormats from '../file-upload/SupportedFormats';
import UploadInstructions from '../file-upload/UploadInstructions';

interface FileUploadTabProps {
  onTextExtracted: (text: string) => void;
  setError: (error: string | null) => void;
}

const FileUploadTab: React.FC<FileUploadTabProps> = ({
  onTextExtracted,
  setError
}) => {
  // Use our hook for file upload state management
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
    // Find the text tab button and click it
    const textTabButton = document.querySelector('[data-state="inactive"][value="text"]');
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
        // Step 1: Initial file selection UI
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <UploadInstructions />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose File
          </Button>
          
          <div className="mt-4">
            <SupportedFormats />
          </div>
        </div>
      ) : (
        // Step 2: File processing UI
        <div className="border-2 border-border rounded-lg p-6">
          {error ? (
            <FileUploadError 
              error={error} 
              onSwitchToTextInput={handleSwitchToTextInput} 
            />
          ) : null}
          
          <div className="mb-4 text-center">
            <h3 className="text-lg font-medium">Processing: {selectedFileName}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isProcessing
                ? `Extracting text from ${processingType || 'file'}...`
                : 'Processing complete!'}
            </p>
          </div>
          
          <UploadProgress
            isProcessing={isProcessing}
            progress={progress}
            processingType={isWordDocument ? 'word' : processingType}
            error={isWordDocument ? "Word documents are not supported. Please save as PDF first." : error}
          />
          
          <div className="flex justify-center space-x-2 mt-4">
            {isProcessing ? (
              <Button
                type="button"
                variant="outline"
                className="flex items-center"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center"
                  onClick={handleReset}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Another File
                </Button>
                
                {!error && !isWordDocument && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center"
                    onClick={handleSwitchToTextInput}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Edit Text
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadTab;
