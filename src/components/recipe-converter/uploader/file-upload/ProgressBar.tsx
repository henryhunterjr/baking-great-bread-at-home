
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressBarProps {
  progress: number;
  processingType: 'image' | 'pdf' | null;
  onCancel?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, processingType, onCancel }) => {
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [lastProgress, setLastProgress] = useState(0);
  
  useEffect(() => {
    // Track progress changes to detect stalls
    if (progress > lastProgress) {
      setLastProgress(progress);
      setShowTimeoutWarning(false);
    }
    
    // If progress gets stuck at the same value for more than 20 seconds, show a timeout warning
    let stuckTimer: number | null = null;
    
    if (processingType && progress > 0 && progress < 100) {
      stuckTimer = window.setTimeout(() => {
        setShowTimeoutWarning(true);
      }, 20000);
    }
    
    // Reset warning if progress changes or completes
    if (progress === 100) {
      setShowTimeoutWarning(false);
    }
    
    return () => {
      if (stuckTimer) window.clearTimeout(stuckTimer);
    };
  }, [progress, processingType, lastProgress]);
  
  if (!processingType) return null;
  
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-muted-foreground">
          {processingType === 'pdf' 
            ? `Extracting text from PDF... ${progress}%` 
            : `Extracting text from image... ${progress}%`}
        </p>
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
        <div className="flex items-start gap-2 text-amber-600 text-xs mt-2 p-2 bg-amber-50 rounded">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Processing is taking longer than expected</p>
            <p>This could be due to a complex file. You can continue waiting or cancel and try a different format.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
