
/**
 * Calculate a timeout duration based on file size
 * @param fileSize File size in bytes
 * @returns Timeout in milliseconds
 */
export const calculateTimeout = (fileSize: number): number => {
  // Base timeout is 60 seconds
  const baseTimeout = 60000;
  
  // Add 1 second for each MB of file size
  const fileSizeMB = fileSize / (1024 * 1024);
  const additionalTimeout = fileSizeMB * 1000;
  
  // Cap at 5 minutes (300,000 ms) maximum
  return Math.min(baseTimeout + additionalTimeout, 300000);
};

/**
 * Create a throttled progress reporter to avoid excessive updates
 * @param reportFn Function to call with progress updates
 * @param throttleMs Minimum time between updates in ms
 * @returns Throttled progress reporter function
 */
export const createThrottledProgressReporter = (
  reportFn: (progress: number) => void,
  throttleMs: number = 250
): ((progress: any) => void) => {
  let lastReportTime = 0;
  
  return (progressData: any) => {
    const now = Date.now();
    
    // Only report if enough time has passed since last report
    if (now - lastReportTime >= throttleMs) {
      // Extract progress value from Tesseract progress object
      if (progressData && progressData.status === 'recognizing text' && 'progress' in progressData) {
        reportFn(progressData.progress);
        lastReportTime = now;
      }
    }
  };
};
