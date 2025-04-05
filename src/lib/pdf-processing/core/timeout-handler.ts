
import { logError, logInfo } from '@/utils/logger';

/**
 * Process a task with timeout handling
 * @param task The async function to execute with timeout protection
 * @param timeoutDuration Timeout in milliseconds
 * @param onProgress Optional progress callback
 * @returns Result of the task or null if timed out/cancelled
 */
export const executeWithTimeout = async <T>(
  task: (progressCallback?: (progress: number) => void) => Promise<T>,
  timeoutDuration: number = 600000, // 10 minutes default
  onProgress?: (progress: number) => void
): Promise<T | null> => {
  let timeoutId: NodeJS.Timeout | null = null;
  let cancelled = false;
  
  try {
    logInfo("Processing task with timeout protection", { timeout: timeoutDuration });
    
    // Set a timeout to prevent indefinite processing
    const timeoutPromise = new Promise<null>((_, reject) => {
      timeoutId = setTimeout(() => {
        cancelled = true;
        reject(new Error(`Processing timed out after ${timeoutDuration/60000} minutes.`));
      }, timeoutDuration);
    });
    
    // Create a progress wrapper that checks for cancellation
    const progressCallback = onProgress ? 
      (progress: number) => {
        if (cancelled) return;
        
        // Report more realistic progress that never reaches 100% until complete
        const adjustedProgress = progress * 0.95; // Cap at 95% until fully complete
        onProgress(adjustedProgress);
      } : undefined;
    
    // Race the actual task against the timeout
    const result = await Promise.race([
      task(progressCallback),
      timeoutPromise
    ]);
    
    // Clear the timeout since we're done
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Check if processing was cancelled
    if (cancelled) return null;
    
    return result;
  } catch (error) {
    logError("Error in task processing with timeout", { error });
    
    // Clear the timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // If it's a timeout error, provide a more helpful message
    if (error instanceof Error && error.message.includes('timed out')) {
      throw new Error(`Processing timed out after ${timeoutDuration/60000} minutes. This may be due to the file being too large or complex.`);
    }
    
    // Rethrow the error for the caller to handle
    throw error;
  }
};
