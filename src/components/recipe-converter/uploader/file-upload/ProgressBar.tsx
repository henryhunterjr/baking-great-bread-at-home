
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  progress: number;
  processingType: 'image' | 'pdf' | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, processingType }) => {
  if (!processingType) return null;
  
  return (
    <div className="mt-4 space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-muted-foreground">
        {processingType === 'pdf' 
          ? `Extracting text from PDF... ${progress}%` 
          : `Extracting text from image... ${progress}%`}
      </p>
    </div>
  );
};

export default ProgressBar;
