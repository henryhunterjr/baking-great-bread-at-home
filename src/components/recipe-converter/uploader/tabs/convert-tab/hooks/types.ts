
export interface PDFProcessingResult {
  text: string | null;
  error: string | null;
}

export interface PDFProcessingCallbacks {
  onComplete?: (result: PDFProcessingResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export interface TextProcessingCallbacks {
  onComplete?: (text: string) => void;
  onError?: (error: string) => void;
}

export interface ImageProcessingCallbacks {
  onComplete?: (text: string) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}
