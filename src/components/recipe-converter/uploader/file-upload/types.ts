
import { CancellableTask } from '@/lib/ai-services/pdf/types';

export interface ProcessingResult {
  cancel: () => void;
}

export interface ProcessingCallbacks {
  onProgress: (progress: number) => void;
  onComplete: (text: string) => void;
  onError: (error: string) => void;
}

export type ProcessingTask = ProcessingResult | null;
