
/**
 * Type for progress callback functions
 */
export type ProgressCallback = (progress: number) => void;

/**
 * Interface for cancellable tasks
 */
export interface CancellableTask {
  cancel: () => void;
}

/**
 * Options for text extraction
 */
export interface TextExtractionOptions {
  signal?: AbortSignal;
  timeout?: number;
}

/**
 * Result of text extraction - either a string or a cancellable task
 */
export type ExtractTextResult = string | CancellableTask;

/**
 * Enum for processing error types
 */
export enum ProcessingErrorType {
  FILE_LOAD = 'file_load',
  TIMEOUT = 'timeout',
  NETWORK = 'network',
  EXTRACTION_FAILED = 'extraction_failed',
  CANCELLED = 'cancelled',
  UNKNOWN = 'unknown'
}

/**
 * Custom error class for processing errors
 */
export class ProcessingError extends Error {
  type: ProcessingErrorType;

  constructor(message: string, type: ProcessingErrorType = ProcessingErrorType.UNKNOWN) {
    super(message);
    this.name = 'ProcessingError';
    this.type = type;
  }
}
