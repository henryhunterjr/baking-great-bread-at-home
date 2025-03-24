
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, X, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressBarProps {
  progress: number;
  processingType: 'image' | 'pdf' | null;
  onCancel?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, processingType, onCancel }) => {
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [lastProgress, setLastProgress] = useState(0);
  const [stuckTime, setStuckTime] = useState(0);
  
  useEffect(() => {
    // Track progress changes to detect stalls
    if (progress > lastProgress) {
      setLastProgress(progress);
      setShowTimeoutWarning(false);
      setStuckTime(0);
    }
    
    // If progress is the same, increment stuck time
    let stuckTimer: number | null = null;
    
    if (processingType && progress > 0 && progress < 100) {
      stuckTimer = window.setInterval(() => {
        setStuckTime(prev => {
          const newTime = prev + 1;
          // If stuck for more than 15 seconds at the same progress, show warning
          if (newTime >= 15 && progress === lastProgress) {
            setShowTimeoutWarning(true);
          }
          return newTime;
        });
      }, 1000);
    }
    
    // Reset warning if progress changes or completes
    if (progress === 100) {
      setShowTimeoutWarning(false);
      setStuckTime(0);
    }
    
    return () => {
      if (stuckTimer) window.clearInterval(stuckTimer);
    };
  }, [progress, processingType, lastProgress]);
  
  if (!processingType) return null;
  
  // Generate dynamic message based on progress and processing type
  const getStatusMessage = () => {
    if (processingType === 'pdf') {
      if (progress < 20) return "Initializing PDF processor...";
      if (progress < 40) return "Reading PDF pages...";
      if (progress < 60) return "Extracting text content...";
      if (progress < 80) return "Processing extracted content...";
      if (progress < 95) return "Finalizing text extraction...";
      return "Processing complete!";
    } else {
      if (progress < 20) return "Initializing image processor...";
      if (progress < 40) return "Analyzing image...";
      if (progress < 60) return "Running OCR text recognition...";
      if (progress < 80) return "Extracting text from image...";
      if (progress < 95) return "Finalizing text extraction...";
      return "Processing complete!";
    }
  };
  
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {getStatusMessage()} <span className="font-mono">{progress}%</span>
          </p>
          {progress > 0 && progress < 100 && (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          )}
        </div>
        {onCancel && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel} 
            className="h-8 px-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>
      
      <Progress value={progress} className="h-2" />
      
      {showTimeoutWarning && (
        <div className="flex items-start gap-2 text-amber-600 text-xs mt-2 p-2 bg-amber-50 rounded border border-amber-200">
          <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Processing is taking longer than expected</p>
            <p>This could be due to a complex file or a processing issue. You can continue waiting or cancel and try a different format.</p>
            {onCancel && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCancel} 
                className="mt-2 h-8 text-xs border-amber-600 text-amber-600 hover:bg-amber-100"
              >
                Cancel Processing
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
