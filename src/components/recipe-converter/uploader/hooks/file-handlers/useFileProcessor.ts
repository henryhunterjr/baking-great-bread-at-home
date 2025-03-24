
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logInfo, logError } from '@/utils/logger';

export interface ProcessingOptions {
  onSuccess: (text: string) => void;
  onError: (error: string) => void;
}

export const useFileProcessor = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Track any ongoing processing task to allow cancellation
  const processingTask = useRef<{ cancel?: () => void } | null>(null);

  const cancelCurrentProcessing = () => {
    if (processingTask.current?.cancel) {
      processingTask.current.cancel();
      processingTask.current = null;
      logInfo("Cancelled current processing task");
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
