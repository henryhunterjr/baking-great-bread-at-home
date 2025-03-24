
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { Progress } from '@/components/ui/progress';

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
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      // For non-image files, use the existing handler
      onFileUpload(e);
      return;
    }
    
    setSelectedFileName(file.name);
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      // Process image with Tesseract OCR
      const worker = await createWorker();
      
      // Set up progress monitoring
      worker.setParameters({
        tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,;:!?()/\\-_\'"\n '
      });
      
      worker.setLogger((m) => {
        if (m.status === 'recognizing text') {
          setProgress(m.progress * 100);
        }
      });
      
      // Recognize text from the image
      const result = await worker.recognize(file);
      
      // Extract the text
      const extractedText = result.data.text;
      
      // Clean up the worker
      await worker.terminate();
      
      // Pass the extracted text to the parent
      if (extractedText.trim().length > 0) {
        onTextExtracted(extractedText);
      } else {
        setError("No text found in the image. Please try with a clearer image.");
      }
    } catch (err) {
      console.error('OCR processing error:', err);
      setError("Failed to process the image. Please try again with a different image.");
    } finally {
      setIsProcessing(false);
    }
  };
  
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
          onChange={handleFileChange}
        />
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
        
        {selectedFileName && (
          <p className="mt-2 text-sm text-muted-foreground">
            Selected: {selectedFileName}
          </p>
        )}
        
        {isProcessing && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Extracting text from image... {Math.round(progress)}%
            </p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        Supported formats: JPEG, PNG, PDF, DOCX, TXT
      </div>
    </div>
  );
};

export default FileUploadTab;
