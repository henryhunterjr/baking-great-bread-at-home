
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  processingType: 'image' | 'pdf' | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, processingType }) => {
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  
  useEffect(() => {
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
  }, [progress, processingType]);
  
  if (!processingType) return null;
  
  return (
    <div className="mt-4 space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-muted-foreground">
        {processingType === 'pdf' 
          ? `Extracting text from PDF... ${progress}%` 
          : `Extracting text from image... ${progress}%`}
      </p>
      
      {showTimeoutWarning && (
        <div className="flex items-start gap-2 text-amber-600 text-xs mt-2 p-2 bg-amber-50 rounded">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Processing is taking longer than expected</p>
            <p>This could be due to a complex file. You can continue waiting or try a different format.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
