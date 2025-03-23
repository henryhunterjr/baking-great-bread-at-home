
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Clipboard, FileText } from 'lucide-react';

interface ConvertOptionsProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  cameraInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCameraCapture: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasteFromClipboard: () => void;
  clearText: () => void;
  hasText: boolean;
}

const ConvertOptions: React.FC<ConvertOptionsProps> = ({
  fileInputRef,
  cameraInputRef,
  handleFileSelect,
  handleCameraCapture,
  handlePasteFromClipboard,
  clearText,
  hasText
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-24 p-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,.pdf,.txt,.doc,.docx"
          onChange={handleFileSelect}
        />
        <Upload className="h-8 w-8 mb-2 text-bread-800" />
        <span className="text-xs text-center">Upload Image or File</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-24 p-2"
        onClick={() => cameraInputRef.current?.click()}
      >
        <input
          type="file"
          ref={cameraInputRef}
          className="hidden"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
        />
        <Camera className="h-8 w-8 mb-2 text-bread-800" />
        <span className="text-xs text-center">Take Photo</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-24 p-2"
        onClick={handlePasteFromClipboard}
      >
        <Clipboard className="h-8 w-8 mb-2 text-bread-800" />
        <span className="text-xs text-center">Paste from Clipboard</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-24 p-2"
        onClick={clearText}
        disabled={!hasText}
      >
        <FileText className="h-8 w-8 mb-2 text-bread-800" />
        <span className="text-xs text-center">Clear Text</span>
      </Button>
    </div>
  );
};

export default ConvertOptions;
