
/**
 * Callback for progress updates during processing
 */
export type ProgressCallback = (progress: number) => void;

/**
 * Result of text extraction operation
 */
export type ExtractTextResult = string | CancellableTask | null;

/**
 * Task that can be cancelled
 */
export interface CancellableTask {
  cancel: () => void;
}

/**
 * Options for text extraction
 */
export interface TextExtractionOptions {
  /**
   * Whether to use OCR for extraction
   */
  useOCR?: boolean;
  
  /**
   * Optional progress callback
   */
  onProgress?: ProgressCallback;
  
  /**
   * Maximum time in milliseconds before the operation times out
   */
  timeoutMs?: number;
}

/**
 * PDF processing error types
 */
export enum ProcessingErrorType {
  TIMEOUT = 'timeout',
  FILE_LOAD = 'file_load',
  OCR_FAILED = 'ocr_failed',
  EXTRACTION_FAILED = 'extraction_failed',
  CANCELLED = 'cancelled',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

/**
 * Processing error with type information
 */
export class ProcessingError extends Error {
  type: ProcessingErrorType;
  
  constructor(message: string, type: ProcessingErrorType) {
    super(message);
    this.type = type;
    this.name = 'ProcessingError';
  }
}
