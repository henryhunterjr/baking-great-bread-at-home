
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { createWorker } from 'tesseract.js';

interface CameraInputTabProps {
  onCameraPicture: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CameraInputTab: React.FC<CameraInputTabProps> = ({ onCameraPicture }) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create preview
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
    
    // Start OCR processing
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      // Create the Tesseract worker
      const worker = await createWorker();
      
      // Set up progress monitoring using the onProgress callback
      worker.setProgressHandler((m: any) => {
        if (m.status === 'recognizing text') {
          setProgress(Math.floor(m.progress * 100));
        }
      });
      
      // Recognize text from the image
      const { data } = await worker.recognize(file);
      
      // Clean up the worker
      await worker.terminate();
      
      // Create a synthetic event to pass to the original handler
      if (data.text.trim().length > 0) {
        // We need to create a synthetic change event with the extracted text
        // But since we can't easily do that, we'll call the original handler 
        // and then handle the actual OCR result in a separate component
        onCameraPicture(e);
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
  
  const resetCapture = () => {
    setPreviewUrl(null);
    setError(null);
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetCapture}
                disabled={isProcessing}
              >
                Try Again
              </Button>
            </div>
          </div>
          
          {isProcessing && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Extracting text from image... {progress}%
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraInputTab;
