
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, X, Loader2, Clock } from 'lucide-react';
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
  const [showSlowWarning, setShowSlowWarning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    let timer: number | null = null;
    
    // Only start timer if we're processing
    if (processingType && progress > 0 && progress < 100) {
      timer = window.setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          // Show slow warning after 15 seconds
          if (newTime >= 15 && !showSlowWarning) {
            setShowSlowWarning(true);
          }
          return newTime;
        });
      }, 1000);
    } else {
      // Reset when done or cancelled
      setElapsedTime(0);
      setShowSlowWarning(false);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [processingType, progress, showSlowWarning]);
  
  if (!processingType || progress === 0) return null;
  
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
  
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          {progress < 100 && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <p className="text-sm font-medium">{getStatusMessage()}</p>
        </div>
        
        {onCancel && progress < 100 && (
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
      />
      
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">
          {progress}% complete
        </span>
        
        {progress < 100 && (
          <span className="flex items-center text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {elapsedTime}s
          </span>
        )}
      </div>
      
      {showSlowWarning && progress < 100 && (
        <div className="text-xs flex items-center text-amber-500 dark:text-amber-400 mt-1">
          <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
          <span>
            This is taking longer than expected.
            {onCancel && (
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-xs text-amber-600 dark:text-amber-400 font-normal"
                onClick={onCancel}
              >
                 Cancel and try a different method
              </Button>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
