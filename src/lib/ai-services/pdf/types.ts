
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
