
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => Promise<void>;
  isDisabled: boolean;
  isProcessing: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  isDisabled,
  isProcessing
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
      onClick={() => fileInputRef.current?.click()}
      disabled={isDisabled || isProcessing}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,.pdf,.txt,.doc,.docx"
        onChange={handleFileChange}
      />
      {isProcessing ? (
        <div className="h-8 w-8 mb-2 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bread-800"></div>
        </div>
      ) : (
        <Upload className="h-8 w-8 mb-2 text-bread-800" />
      )}
      <span className="text-xs text-center">
        {isProcessing ? "Processing..." : "Upload Image or File"}
      </span>
    </Button>
  );
};

export default FileUploadButton;
