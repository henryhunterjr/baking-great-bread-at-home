
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProgressBar from '../file-upload/ProgressBar';
import SelectedFile from '../file-upload/SelectedFile';
import FileUploadError from '../file-upload/FileUploadError';
import { processImageFile, processPDFFile } from '../file-upload/FileProcessor';

interface FileUploadTabProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextExtracted: (text: string) => void;
}

const FileUploadTab: React.FC<FileUploadTabProps> = ({ onFileUpload, onTextExtracted }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingType, setProcessingType] = useState<'image' | 'pdf' | null>(null);
  const { toast } = useToast();
  
  // Add abort controller reference to handle cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    resetState();
    setSelectedFileName(file.name);
    
    // Create new AbortController for this operation
    abortControllerRef.current = new AbortController();
    
    // Check file type
    if (file.type === 'application/pdf') {
      // Handle PDF file
      await handlePDFFile(file);
    } else if (file.type.startsWith('image/')) {
      // Handle image file with OCR
      await handleImageFile(file);
    } else {
      // For other file types (text, etc.), use the existing handler
      onFileUpload(e);
    }
  };
  
  const resetState = () => {
    setIsProcessing(false);
    setProcessingType(null);
    setProgress(0);
    setError(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleCancel = () => {
    // Cancel any ongoing processing
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    toast({
      title: "Processing Cancelled",
      description: "File processing has been cancelled.",
    });
    
    resetState();
  };
  
  const handlePDFFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingType('pdf');
    setProgress(0);
    
    await processPDFFile(
      file,
      (progressValue) => setProgress(progressValue),
      (cleanedText) => {
        onTextExtracted(cleanedText);
        toast({
          title: "PDF Processed Successfully",
          description: "We've extracted the recipe text from your PDF.",
        });
        setIsProcessing(false);
        setProcessingType(null);
      },
      (errorMessage) => {
        setError(errorMessage);
        setIsProcessing(false);
        setProcessingType(null);
      }
    );
  };
  
  const handleImageFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingType('image');
    setProgress(0);
    
    await processImageFile(
      file,
      (progressValue) => setProgress(progressValue),
      (extractedText) => {
        onTextExtracted(extractedText);
        toast({
          title: "Image Processed Successfully",
          description: "We've extracted the recipe text from your image.",
        });
        setIsProcessing(false);
        setProcessingType(null);
      },
      (errorMessage) => {
        setError(errorMessage);
        setIsProcessing(false);
        setProcessingType(null);
      }
    );
  };
  
  const handleReset = () => {
    handleCancel();
    setSelectedFileName(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Upload Recipe File</h3>
        <p className="text-muted-foreground mb-4">
          Upload an image, PDF, or document of your recipe
        </p>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.docx,.txt"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex gap-2 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isProcessing ? 'Processing...' : 'Select File'}
          </Button>
          
          {(selectedFileName || error) && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="border-muted"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
        
        <SelectedFile fileName={selectedFileName} />
        <ProgressBar 
          progress={progress} 
          processingType={processingType} 
          onCancel={isProcessing ? handleCancel : undefined}
        />
        <FileUploadError error={error} />
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        Supported formats: JPEG, PNG, PDF, DOCX, TXT
      </div>
    </div>
  );
};

export default FileUploadTab;
