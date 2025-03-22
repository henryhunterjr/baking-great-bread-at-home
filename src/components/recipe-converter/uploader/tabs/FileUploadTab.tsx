
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadTabProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadTab: React.FC<FileUploadTabProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Upload Recipe File</h3>
        <p className="text-muted-foreground mb-4">
          Upload an image or document of your recipe
        </p>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.docx,.txt"
          className="hidden"
          onChange={onFileUpload}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Select File
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        Supported formats: JPEG, PNG, PDF, DOCX, TXT
      </div>
    </div>
  );
};

export default FileUploadTab;
