
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';

interface UploadProgressProps {
  isProcessing: boolean;
  progress: number;
  processingType?: 'image' | 'pdf' | 'word' | null;
  error?: string | null;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  isProcessing,
  progress,
  processingType,
  error
}) => {
  // Determine the appropriate text to display based on the processing state
  const getProcessingText = () => {
    if (error) return error;
    if (!isProcessing) return 'Processing complete';
    
    switch (processingType) {
      case 'image':
        return 'Extracting text with OCR...';
      case 'pdf':
        return 'Extracting text from PDF...';
      case 'word':
        return 'Word documents are not directly supported. Please save as PDF first.';
      default:
        return 'Processing file...';
    }
  };
  
  return (
    <div className="space-y-2">
      <Progress 
        value={progress} 
        className={`h-2 ${error ? 'bg-red-100' : ''}`}
      />
      <div className="flex items-center justify-center gap-2 text-sm text-center text-muted-foreground">
        {error && <AlertCircle className="h-4 w-4 text-destructive" />}
        <p>
          {getProcessingText()} {!error && `(${Math.round(progress)}%)`}
        </p>
      </div>
    </div>
  );
};

export default UploadProgress;
