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
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  
  useEffect(() => {
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);
  
  useEffect(() => {
    let warningTimeoutId: number | null = null;
    
    if (isProcessing && progress > 0 && progress < 100) {
      warningTimeoutId = window.setTimeout(() => {
        setProcessingTooLong(true);
      }, 20000);
    }
    
    return () => {
      if (warningTimeoutId !== null) {
        window.clearTimeout(warningTimeoutId);
      }
    };
  }, [isProcessing, progress]);
  
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
    
    setIsProcessing(true);
    setProgress(0);
    setLocalError(null);
    setError(null);
    setProcessingTooLong(false);
    
    const id = window.setTimeout(() => {
      if (isProcessing) {
        handleCancelProcessing();
        setLocalError("OCR processing timed out. The image may be too complex or low quality. Try with a clearer image or manually type the recipe.");
        setError("OCR processing timed out. The image may be too complex or low quality. Try with a clearer image or manually type the recipe.");
      }
    }, 180000);
    
    setTimeoutId(id);
    
    try {
      const extractedResult = await extractTextWithOCR(
        file, 
        (progressValue) => {
          setProgress(progressValue);
        }
      );
      
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      
      if (extractedResult && typeof extractedResult === 'object' && 'cancel' in extractedResult) {
        return;
      }
      
      const extractedText = extractedResult as string;
      
      if (extractedText && extractedText.trim().length > 0) {
        onTextExtracted(extractedText);
        
        setTimeout(() => {
          setIsProcessing(false);
          setProgress(100);
        }, 500);
        
        toast({
          title: "Text Extracted Successfully",
          description: "We've processed your image and extracted the recipe text.",
        });
      } else {
        const noTextError = "No text could be found in this image. Try taking a clearer photo with good lighting.";
        setLocalError(noTextError);
        setError(noTextError);
        setIsProcessing(false);
      }
    } catch (err) {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      
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
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
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
  
  const handleCancelProcessing = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
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
          
          <FileUploadError error={error} onRetry={resetCapture} />
        </div>
      )}
    </div>
  );
};

export default CameraInputTab;
