
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => Promise<void>;
  isDisabled: boolean;
  isProcessing: boolean;
  onCancel?: () => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  isDisabled,
  isProcessing,
  onCancel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await onFileSelect(file);
    
    // Reset the file input to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Button 
      variant="outline" 
      className="flex flex-col items-center justify-center h-24 p-2"
      onClick={() => {
        if (isProcessing && onCancel) {
          onCancel();
        } else {
          fileInputRef.current?.click();
        }
      }}
      disabled={isDisabled}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,.pdf,.txt,.doc,.docx"
        onChange={handleFileChange}
      />
      {isProcessing ? (
        <>
          <div className="h-8 w-8 mb-2 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bread-800"></div>
          </div>
          <span className="text-xs text-center">
            {onCancel ? "Processing... (Click to Cancel)" : "Processing..."}
          </span>
        </>
      ) : (
        <>
          <Upload className="h-8 w-8 mb-2 text-bread-800" />
          <span className="text-xs text-center">
            Upload Image or File
          </span>
        </>
      )}
    </Button>
  );
};

export default FileUploadButton;
