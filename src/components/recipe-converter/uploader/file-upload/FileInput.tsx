
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, RefreshCw } from 'lucide-react';

interface FileInputProps {
  onFileSelect: () => void;
  onReset: () => void;
  isProcessing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  hasFile: boolean;
  hasError: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<FileInputProps> = ({
  onFileSelect,
  onReset,
  isProcessing,
  fileInputRef,
  hasFile,
  hasError,
  onChange
}) => {
  return (
    <div className="flex gap-2 justify-center">
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.docx,.txt"
        className="hidden"
        onChange={onChange}
      />
      <Button
        type="button"
        variant="outline"
        onClick={onFileSelect}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {isProcessing ? 'Processing...' : 'Select File'}
      </Button>
      
      {(hasFile || hasError) && (
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="border-muted"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
};

export default FileInput;
