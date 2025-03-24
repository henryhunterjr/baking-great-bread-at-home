
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface CameraButtonProps {
  onImageCapture: (file: File) => Promise<void>;
  isDisabled: boolean;
  isProcessing: boolean;
}

const CameraButton: React.FC<CameraButtonProps> = ({
  onImageCapture,
  isDisabled,
  isProcessing
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await onImageCapture(file);
    
    // Reset the camera input to allow taking the same photo again
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  return (
    <Button 
      variant="outline" 
      className="flex flex-col items-center justify-center h-24 p-2"
      onClick={() => cameraInputRef.current?.click()}
      disabled={isDisabled || isProcessing}
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
  );
};

export default CameraButton;
