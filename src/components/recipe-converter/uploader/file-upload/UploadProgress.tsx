
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  isProcessing: boolean;
  progress: number;
  processingType?: 'image' | 'pdf' | null;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  isProcessing,
  progress,
  processingType
}) => {
  // Determine the appropriate text to display based on the processing state
  const getProcessingText = () => {
    if (!isProcessing) return 'Processing complete';
    
    switch (processingType) {
      case 'image':
        return 'Extracting text with OCR...';
      case 'pdf':
        return 'Extracting text from PDF...';
      default:
        return 'Processing file...';
    }
  };
  
  return (
    <div className="space-y-2">
      <Progress 
        value={progress} 
        className="h-2" 
      />
      <p className="text-sm text-center text-muted-foreground">
        {getProcessingText()} ({Math.round(progress)}%)
      </p>
    </div>
  );
};

export default UploadProgress;
