
import React from 'react';
import { Button } from '@/components/ui/button';
import UploadInstructions from '../../file-upload/UploadInstructions';
import SupportedFormats from '../../file-upload/SupportedFormats';

interface FileUploadInitialProps {
  onSelectFile: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileUploadInitial: React.FC<FileUploadInitialProps> = ({
  onSelectFile,
  fileInputRef
}) => {
  return (
    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
      <UploadInstructions />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.txt"
        className="hidden"
        onChange={onSelectFile}
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
  );
};

export default FileUploadInitial;
