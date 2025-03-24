
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Clipboard, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractTextWithOCR } from '@/lib/ai-services/pdf/ocr-processor';
import { extractTextFromPDF } from '@/lib/ai-services/pdf/pdf-extractor';

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Track any ongoing processing task to allow cancellation
  const processingTask = useRef<{ cancel?: () => void } | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Cancel any ongoing processing
    if (processingTask.current?.cancel) {
      processingTask.current.cancel();
    }
    
    try {
      setIsProcessing(true);
      
      if (file.type.includes('image/')) {
        await handleImageFile(file);
      } else if (file.type.includes('application/pdf')) {
        await handlePDFFile(file);
      } else {
        // Handle text files and other formats
        const text = await readFileAsText(file);
        setRecipeText(text || "");
        
        toast({
          title: "File Loaded",
          description: "Text has been successfully loaded from the file.",
        });
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: error instanceof Error 
          ? error.message
          : "Failed to process the file. Please try another file or format.",
      });
    } finally {
      setIsProcessing(false);
      processingTask.current = null;
      
      // Reset the file input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageFile = async (file: File) => {
    try {
      toast({
        title: "Processing Image",
        description: "Extracting text from your image...",
      });
      
      // Progress callback to update UI
      let lastProgress = 0;
      const updateProgress = (progress: number) => {
        if (progress > lastProgress + 5) {
          lastProgress = progress;
          toast({
            title: "Processing Image",
            description: `Extracting text: ${progress}% complete`,
          });
        }
      };
      
      // Use OCR to extract text from the image
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
        description: error instanceof Error 
          ? `Failed to extract text: ${error.message}`
          : "Failed to extract text from the image.",
      });
      throw error;
    }
  };
  
  const handlePDFFile = async (file: File) => {
    try {
      toast({
        title: "Processing PDF",
        description: "Extracting text from your PDF...",
      });
      
      // Progress callback to update UI
      let lastToastProgress = 0;
      const updateProgress = (progress: number) => {
        if (progress > lastToastProgress + 10) {
          lastToastProgress = progress;
          toast({
            title: "Processing PDF",
            description: `Extracting text: ${progress}% complete`,
          });
        }
      };
      
      // Extract text from PDF
      const extractedText = await extractTextFromPDF(file, updateProgress);
      
      setRecipeText(extractedText);
      
      toast({
        title: "Text Extracted",
        description: "Successfully extracted text from your PDF.",
      });
    } catch (error) {
      console.error('PDF processing error:', error);
      toast({
        variant: "destructive",
        title: "PDF Error",
        description: error instanceof Error 
          ? `Failed to extract text: ${error.message}`
          : "Failed to extract text from the PDF.",
      });
      throw error;
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
    
    handleImageFile(file).catch(error => {
      console.error('Camera capture error:', error);
    });
    
    // Reset the camera input to allow taking the same photo again
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };
  
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      
      if (clipboardText) {
        setRecipeText(clipboardText);
        
        toast({
          title: "Text Pasted",
          description: "Recipe text pasted from clipboard.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Clipboard Empty",
          description: "No text found in clipboard. Try copying some text first.",
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
  
  const clearText = () => {
    setRecipeText('');
    toast({
      title: "Text Cleared",
      description: "Recipe text has been cleared.",
    });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-24 p-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={isConverting || isProcessing}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,.pdf,.txt,.doc,.docx"
          onChange={handleFileSelect}
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
      
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-24 p-2"
        onClick={() => cameraInputRef.current?.click()}
        disabled={isConverting || isProcessing}
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
        disabled={isConverting || isProcessing}
      >
        <Clipboard className="h-8 w-8 mb-2 text-bread-800" />
        <span className="text-xs text-center">Paste from Clipboard</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="flex flex-col items-center justify-center h-24 p-2"
        onClick={clearText}
        disabled={isConverting || isProcessing}
      >
        <FileText className="h-8 w-8 mb-2 text-bread-800" />
        <span className="text-xs text-center">Clear Text</span>
      </Button>
    </div>
  );
};

export default FileUploadOptions;
