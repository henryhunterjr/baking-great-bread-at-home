
/**
 * Type definitions for PDF processing operations
 */

// Callback for progress updates
export type ProgressCallback = (progress: number) => void;

// Cancellable task interface
export interface CancellableTask {
  cancel: () => void;
}

// Error types enum for better error handling
export enum ProcessingErrorType {
  NETWORK = 'network_error',
  FILE_LOAD = 'file_load_error',
  EXTRACTION_FAILED = 'extraction_failed',
  TIMEOUT = 'timeout_error',
  USER_CANCELLED = 'user_cancelled',
  UNSUPPORTED_FORMAT = 'unsupported_format',
  UNKNOWN = 'unknown_error'
}

// Custom error class for PDF processing
export class ProcessingError extends Error {
  type: ProcessingErrorType;
  
  constructor(message: string, type: ProcessingErrorType = ProcessingErrorType.UNKNOWN) {
    super(message);
    this.name = 'ProcessingError';
    this.type = type;
  }
}
