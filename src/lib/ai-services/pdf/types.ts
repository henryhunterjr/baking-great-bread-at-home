
export enum ProcessingErrorType {
  FILE_LOAD = 'file_load',
  EXTRACTION_FAILED = 'extraction_failed',
  TIMEOUT = 'timeout',
  NETWORK = 'network',
  MEMORY = 'memory',
  OCR_FAILED = 'ocr_failed',
  FILE_TOO_LARGE = 'file_too_large'
}

export class ProcessingError extends Error {
  type: ProcessingErrorType;
  
  constructor(message: string, type: ProcessingErrorType) {
    super(message);
    this.type = type;
    this.name = 'ProcessingError';
  }
}

export type ProgressCallback = (progress: number) => void;

export type CancellableTask = {
  cancel: () => void;
};

export type ExtractTextResult = string | CancellableTask;

export interface TextExtractionOptions {
  timeout?: number;
  useOCRFallback?: boolean;
}
