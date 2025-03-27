
import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { extractTextWithOCR } from '@/lib/ai-services/pdf/ocr-processor';
import FileUploadError from '../file-upload/FileUploadError';
import { useToast } from '@/hooks/use-toast';

interface CameraInputTabProps {
  onTextExtracted: (text: string) => void;
  setError: (error: string | null) => void;
}

const CameraInputTab: React.FC<CameraInputTabProps> = ({ onTextExtracted, setError }) => {
  const { toast } = useToast();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setLocalError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processingTooLong, setProcessingTooLong] = useState(false);
  
  // Set up a timer to detect when processing is taking too long
  useEffect(() => {
    let timeoutId: number | null = null;
    
    if (isProcessing && progress > 0 && progress < 100) {
      timeoutId = window.setTimeout(() => {
        setProcessingTooLong(true);
      }, 20000); // Show warning after 20 seconds
    }
    
    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isProcessing, progress]);
  
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create preview
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
    
    // Start OCR processing
    setIsProcessing(true);
    setProgress(0);
    setLocalError(null);
    setError(null);
    setProcessingTooLong(false);
    
    try {
      // Set up a timeout for OCR processing
      const processingPromise = extractTextWithOCR(
        file, 
        (progressValue) => {
          setProgress(progressValue);
        }
      );
      
      // Create a timeout promise
      const timeoutPromise = new Promise<string>((_, reject) => {
        const id = setTimeout(() => {
          reject(new Error("OCR processing timed out. The image may be too complex."));
        }, 60000); // 60 second timeout
        
        return () => clearTimeout(id);
      });
      
      // Race between processing and timeout
      const extractedText = await Promise.race([processingPromise, timeoutPromise]);
      
      if (extractedText.trim().length > 0) {
        // Pass the extracted text to the parent
        onTextExtracted(extractedText);
        
        // Reset processing state
        setTimeout(() => {
          setIsProcessing(false);
          setProgress(100);
        }, 500);
      } else {
        const noTextError = "No text could be found in this image. Try taking a clearer photo with good lighting.";
        setLocalError(noTextError);
        setError(noTextError);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('OCR processing error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to process the image. Please try again with a different image.";
      setLocalError(errorMessage);
      setError(errorMessage);
      setIsProcessing(false);
    }
  };
  
  const resetCapture = () => {
    setPreviewUrl(null);
    setLocalError(null);
    setError(null);
    setIsProcessing(false);
    setProgress(0);
    setProcessingTooLong(false);
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };
  
  // Handle when the user wants to cancel processing
  const handleCancelProcessing = () => {
    setIsProcessing(false);
    setLocalError("OCR processing was cancelled. Please try again with a different image.");
    toast({
      title: "Processing Cancelled",
      description: "Image processing has been cancelled.",
    });
  };
  
  return (
    <div className="space-y-6">
      {!previewUrl ? (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Camera className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Take a Photo</h3>
          <p className="text-muted-foreground mb-4">
            Use your camera to take a photo of your recipe
          </p>
          <Input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCameraCapture}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isProcessing ? 'Processing...' : 'Open Camera'}
          </Button>
        </div>
      ) : (
        <div className="border-2 border-border rounded-lg p-4 text-center">
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Camera capture" 
              className="max-h-64 mx-auto rounded-md object-contain" 
            />
            <div className="mt-4 flex justify-center space-x-2">
              {isProcessing ? (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleCancelProcessing}
                >
                  Cancel Processing
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetCapture}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}
            </div>
          </div>
          
          {isProcessing && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Extracting text from image... {progress}%
              </p>
              {processingTooLong && (
                <p className="text-sm text-amber-600">
                  This is taking longer than expected. Complex images may need more time to process.
                </p>
              )}
            </div>
          )}
          
          <FileUploadError error={error} />
        </div>
      )}
    </div>
  );
};

export default CameraInputTab;
