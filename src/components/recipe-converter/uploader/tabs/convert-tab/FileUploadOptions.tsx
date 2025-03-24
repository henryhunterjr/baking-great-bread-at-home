
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Clipboard, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractTextWithOCR } from '@/lib/ai-services/pdf/ocr-processor';

interface FileUploadOptionsProps {
  setRecipeText: (text: string) => void;
  isConverting: boolean;
}

const FileUploadOptions: React.FC<FileUploadOptionsProps> = ({ 
  setRecipeText, 
  isConverting 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // For demo purposes, we're using a simplified approach
      // In production, you'd want to use more robust processing
      if (file.type.includes('image/')) {
        handleImageFile(file);
      } else if (file.type.includes('application/pdf')) {
        // Handle PDF files (simplified for demo)
        const text = await readFileAsText(file);
        setRecipeText(text || "");
      } else {
        // Handle text files and other formats
        const text = await readFileAsText(file);
        setRecipeText(text || "");
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: "Failed to process the file. Please try another file or format.",
      });
    }
  };

  const handleImageFile = async (file: File) => {
    try {
      toast({
        title: "Processing Image",
        description: "Extracting text from your image...",
      });
      
      // Progress callback to update UI
      const updateProgress = (progress: number) => {
        console.log(`OCR Progress: ${progress}%`);
      };
      
      // Use OCR to extract text from the image with v6 compatible API
      const extractedText = await extractTextWithOCR(file, updateProgress);
      
      setRecipeText(extractedText);
      
      toast({
        title: "Text Extracted",
        description: "Successfully extracted text from your image.",
      });
    } catch (error) {
      console.error('OCR processing error:', error);
      toast({
        variant: "destructive",
        title: "OCR Error",
        description: "Failed to extract text from the image.",
      });
    }
  };
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string || "");
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    handleImageFile(file);
  };
  
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setRecipeText(clipboardText || "");
      
      if (clipboardText) {
        toast({
          title: "Text Pasted",
          description: "Recipe text pasted from clipboard.",
        });
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      toast({
        variant: "destructive",
        title: "Clipboard Error",
        description: "Unable to access clipboard. Please paste the text manually.",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-24 p-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={isConverting}
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
        disabled={isConverting}
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
        disabled={isConverting}
      >
        <Clipboard className="h-8 w-8 mb-2 text-bread-800" />
        <span className="text-xs text-center">Paste from Clipboard</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-24 p-2"
        onClick={() => setRecipeText('')}
        disabled={!isConverting && !setRecipeText}
      >
        <FileText className="h-8 w-8 mb-2 text-bread-800" />
        <span className="text-xs text-center">Clear Text</span>
      </Button>
    </div>
  );
};

export default FileUploadOptions;
