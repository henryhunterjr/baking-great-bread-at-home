
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, FileText } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { Progress } from '@/components/ui/progress';
import { extractTextFromPDF, cleanPDFText } from '@/lib/ai-services/pdf-processor';
import { useToast } from '@/hooks/use-toast';

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
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFileName(file.name);
    setError(null);
    
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
  
  const handlePDFFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingType('pdf');
    setProgress(0);
    
    try {
      // Extract text from the PDF
      const extractedText = await extractTextFromPDF(file, (progressValue) => {
        setProgress(progressValue);
      });
      
      if (extractedText.trim().length === 0) {
        setError("No text found in the PDF. Please try with a different file.");
        return;
      }
      
      // Clean the extracted text
      const cleanedText = cleanPDFText(extractedText);
      
      // Pass the cleaned text to the parent component
      onTextExtracted(cleanedText);
      
      toast({
        title: "PDF Processed Successfully",
        description: "We've extracted the recipe text from your PDF.",
      });
    } catch (err) {
      console.error('PDF processing error:', err);
      setError("Failed to process the PDF. Please try again with a different file.");
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  };
  
  const handleImageFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingType('image');
    setProgress(0);
    
    try {
      // Create worker and monitor progress with the logger callback
      const worker = await createWorker({
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.floor((m.progress || 0) * 100));
          }
        },
      } as any);
      
      // Recognize text from the image
      const { data } = await worker.recognize(file);
      
      // Clean up the worker
      await worker.terminate();
      
      // Pass the extracted text to the parent
      if (data.text.trim().length > 0) {
        onTextExtracted(data.text);
        
        toast({
          title: "Image Processed Successfully",
          description: "We've extracted the recipe text from your image.",
        });
      } else {
        setError("No text found in the image. Please try with a clearer image.");
      }
    } catch (err) {
      console.error('OCR processing error:', err);
      setError("Failed to process the image. Please try again with a different image.");
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
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
          <div className="mt-2 text-sm text-muted-foreground flex items-center justify-center">
            <FileText className="h-4 w-4 mr-1" />
            <p>Selected: {selectedFileName}</p>
          </div>
        )}
        
        {isProcessing && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {processingType === 'pdf' 
                ? `Extracting text from PDF... ${progress}%` 
                : `Extracting text from image... ${progress}%`}
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
