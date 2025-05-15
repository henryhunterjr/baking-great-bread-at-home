
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface CameraButtonProps {
  onCapture: (text: string) => void;
  isDisabled: boolean;
  isProcessing: boolean;
}

const CameraButton: React.FC<CameraButtonProps> = ({
  onCapture,
  isDisabled,
  isProcessing,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    // For now, just simulating camera capture with sample text
    if (!isDisabled && !isProcessing) {
      setIsActive(true);
      setTimeout(() => {
        onCapture("Sample recipe text captured from camera");
        setIsActive(false);
      }, 1500);
    }
  };

  return (
    <Button
      variant="outline"
      className="flex flex-col items-center justify-center h-24 p-2"
      onClick={handleClick}
      disabled={isDisabled || isProcessing}
    >
      {isProcessing || isActive ? (
        <>
          <div className="h-8 w-8 mb-2 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bread-800"></div>
          </div>
          <span className="text-xs text-center">Processing...</span>
        </>
      ) : (
        <>
          <Camera className="h-8 w-8 mb-2 text-bread-800" />
          <span className="text-xs text-center">Take Photo</span>
        </>
      )}
    </Button>
  );
};

export default CameraButton;
