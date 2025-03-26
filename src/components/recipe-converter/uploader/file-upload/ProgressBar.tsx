
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, X, Loader2, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressBarProps {
  progress: number;
  processingType: 'image' | 'pdf' | null;
  onCancel?: () => void;
  onRetry?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  processingType, 
  onCancel,
  onRetry 
}) => {
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [lastProgress, setLastProgress] = useState(0);
  const [stuckTime, setStuckTime] = useState(0);
  const [showSlowWarning, setShowSlowWarning] = useState(false);
  
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
          // If stuck for more than 10 seconds at the same progress, show warning (reduced from 15)
          if (newTime >= 10 && progress === lastProgress) {
            setShowTimeoutWarning(true);
          }
          // If processing is taking more than 25 seconds overall, show slow warning (reduced from 30)
          if (newTime >= 25 && !showSlowWarning) {
            setShowSlowWarning(true);
          }
          return newTime;
        });
      }, 1000);
    }
    
    // Reset warning if progress changes or completes
    if (progress === 100) {
      setShowTimeoutWarning(false);
      setShowSlowWarning(false);
      setStuckTime(0);
    }
    
    return () => {
      if (stuckTimer) window.clearInterval(stuckTimer);
    };
  }, [progress, processingType, lastProgress, showSlowWarning]);
  
  if (!processingType) return null;
  
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
  
  // Generate more detailed help text for warnings
  const getHelpText = () => {
    if (processingType === 'pdf') {
      if (progress < 20) return "PDF loading can take time for large or complex documents. You can try with a simpler PDF.";
      if (progress < 60) return "Text extraction works best with well-formatted PDFs. OCR will be used as a fallback if needed.";
      if (progress >= 80) return "OCR is processing your PDF as an image. This works best with clear, high-contrast text.";
    } else {
      return "OCR works best with clear, high-contrast text. Handwritten or stylized text may take longer.";
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
        {onCancel && progress < 100 && (
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
      
      {/* Help text for normal processing */}
      {!showTimeoutWarning && progress < 95 && (
        <div className="text-xs text-muted-foreground mt-1">
          {getHelpText()}
        </div>
      )}
      
      {showTimeoutWarning && (
        <div className="flex items-start gap-2 text-amber-600 text-xs mt-2 p-2 bg-amber-50 rounded border border-amber-200">
          <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Processing is taking longer than expected</p>
            <p>This could be due to a complex file or a processing issue. You can continue waiting or cancel and try a different format.</p>
            <div className="flex gap-2 mt-2">
              {onCancel && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onCancel} 
                  className="h-8 text-xs border-amber-600 text-amber-600 hover:bg-amber-100"
                >
                  Cancel Processing
                </Button>
              )}
              {onRetry && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRetry} 
                  className="h-8 text-xs border-amber-600 text-amber-600 hover:bg-amber-100"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {showSlowWarning && !showTimeoutWarning && (
        <div className="text-xs text-amber-600 mt-1">
          Processing large or complex files can take up to a minute. Please be patient.
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
