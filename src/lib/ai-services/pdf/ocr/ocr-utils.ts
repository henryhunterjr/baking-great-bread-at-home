import { logInfo } from '@/utils/logger';

/**
 * Calculate an appropriate timeout for processing based on file size
 * @param fileSize Size of the file in bytes
 * @returns Timeout in milliseconds
 */
export const calculateTimeout = (fileSize: number): number => {
  // Base timeout of 60 seconds
  const baseTimeout = 60000;
  
  // Add 1 second per 100KB with a max of 5 minutes
  const additionalTimeout = Math.min(
    (fileSize / 102400) * 1000, 
    240000
  );
  
  return baseTimeout + additionalTimeout;
};

/**
 * Creates a throttled progress reporter function to reduce UI updates
 */
export const createThrottledProgressReporter = (
  callback: (progress: number) => void,
  throttleMs: number = 250
): ((progress: number) => void) => {
  let lastReportTime = 0;
  let lastReportedValue = 0;
  
  return (progress: number) => {
    const now = Date.now();
    
    // Always report 0 and 100% immediately
    if (progress === 0 || progress === 100 || 
        // Otherwise throttle based on time and value change
        (now - lastReportTime > throttleMs && 
         Math.abs(progress - lastReportedValue) >= 1)) {
      
      callback(progress);
      lastReportTime = now;
      lastReportedValue = progress;
      
      // Log progress updates at specific intervals
      if (progress % 10 === 0 || progress === 100) {
        logInfo(`Progress update: ${Math.round(progress)}%`);
      }
    }
  };
};
