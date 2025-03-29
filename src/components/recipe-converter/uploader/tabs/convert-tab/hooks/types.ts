
export interface PDFProcessingResult {
  text: string | null;
  error: string | null;
}

export interface PDFProcessingCallbacks {
  onProgress?: (progress: number) => void;
  onComplete?: (result: PDFProcessingResult) => void;
  onError?: (error: string) => void;
}
