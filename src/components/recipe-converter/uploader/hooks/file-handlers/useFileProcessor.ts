
import { useRef, useState } from 'react';

export interface ProcessingOptions {
  onSuccess: (text: string) => void;
  onError: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export const useFileProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const processingTask = useRef<{ cancel: () => void } | null>(null);
  
  const cancelCurrentProcessing = (): boolean => {
    if (processingTask.current) {
      processingTask.current.cancel();
      processingTask.current = null;
      return true;
    }
    return false;
  };
  
  return {
    isProcessing,
    setIsProcessing,
    processingTask,
    cancelCurrentProcessing
  };
};
