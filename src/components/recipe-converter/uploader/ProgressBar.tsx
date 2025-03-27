
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressBarProps {
  progress: number;
  processingType: 'image' | 'pdf' | null;
  onCancel?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  processingType, 
  onCancel 
}) => {
  // Avoid rendering if not processing
  if (!processingType || progress === 0) {
    return null;
  }
  
  // Generate more detailed dynamic message based on progress and processing type
  const getStatusMessage = () => {
    if (processingType === 'pdf') {
      if (progress < 10) return "Preparing PDF file...";
      if (progress < 20) return "Loading PDF document...";
      if (progress < 40) return "Extracting text from pages...";
      if (progress < 60) return "Processing content...";
      if (progress < 70) return "Finalizing extraction...";
      if (progress < 80) return "Checking extraction quality...";
      if (progress === 80) return "Starting OCR fallback...";
      if (progress < 90) return "Running OCR recognition...";
      if (progress < 95) return "Processing OCR results...";
      return "Processing complete!";
    } else {
      if (progress < 20) return "Reading image...";
      if (progress < 40) return "Preparing image for OCR...";
      if (progress < 60) return "Running text recognition...";
      if (progress < 80) return "Extracting text from image...";
      if (progress < 95) return "Finalizing text extraction...";
      return "Processing complete!";
    }
  };
  
  // Only show cancel button if we have a cancel handler and we're not at 100%
  const showCancelButton = onCancel && progress < 100;
  
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium">{getStatusMessage()}</p>
        {showCancelButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="h-6 px-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>
      
      <Progress 
        value={progress} 
        className="h-2" 
        aria-label={`${processingType} processing progress: ${progress}%`}
      />
      
      {progress > 0 && progress < 100 && (
        <p className="text-xs text-muted-foreground mt-1">
          {progress}% - This process may take some time depending on the file size and complexity.
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
