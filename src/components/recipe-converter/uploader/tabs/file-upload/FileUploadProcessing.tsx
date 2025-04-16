
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowRight, FileText } from 'lucide-react';
import UploadProgress from '../../file-upload/UploadProgress';
import FileUploadError from '../../FileProcessingError';

interface FileUploadProcessingProps {
  fileName: string;
  isProcessing: boolean;
  progress: number;
  error: string | null;
  processingType: 'image' | 'pdf' | null;
  onReset: () => void;
  onSwitchToTextInput: () => void;
  onCancel: () => void;
  isWordDocument: boolean;
}

const FileUploadProcessing: React.FC<FileUploadProcessingProps> = ({
  fileName,
  isProcessing,
  progress,
  error,
  processingType,
  onReset,
  onSwitchToTextInput,
  onCancel,
  isWordDocument
}) => {
  return (
    <div className="border-2 border-border rounded-lg p-6">
      {error ? (
        <FileUploadError 
          error={error} 
          onSwitchToTextInput={onSwitchToTextInput} 
        />
      ) : null}
      
      <div className="mb-4 text-center">
        <h3 className="text-lg font-medium">Processing: {fileName}</h3>
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
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              className="flex items-center"
              onClick={onReset}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Another File
            </Button>
            
            {!error && !isWordDocument && (
              <Button
                type="button"
                variant="outline"
                className="flex items-center"
                onClick={onSwitchToTextInput}
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
  );
};

export default FileUploadProcessing;
