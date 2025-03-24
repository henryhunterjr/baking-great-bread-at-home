
/**
 * Types related to PDF processing
 */

// Cancellable task interface for operations that can be interrupted
export interface CancellableTask {
  cancel: () => void;
}

// Type for the extract text result: either a string with text content or a cancellable task
export type ExtractTextResult = string | CancellableTask | null;

// Progress reporting callback type
export type ProgressCallback = (progress: number) => void;
