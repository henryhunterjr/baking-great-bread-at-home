/**
 * Calculate appropriate timeout for OCR operations based on image complexity
 * 
 * @param fileSize Size of the file in bytes
 * @param isScanned Whether the image appears to be a scanned document
 * @returns Timeout in milliseconds
 */
export const calculateTimeout = (fileSize: number, isScanned: boolean = false): number => {
  // Base timeout
  let timeout = 30000; // 30 seconds
  
  // Adjust for file size
  if (fileSize > 5 * 1024 * 1024) { // 5MB
    timeout += 30000; // Add 30 seconds for large files
  } else if (fileSize > 2 * 1024 * 1024) { // 2MB
    timeout += 15000; // Add 15 seconds for medium files
  }
  
  // Adjust for scanned documents
  if (isScanned) {
    timeout += 20000; // Scanned documents take longer to process
  }
  
  // Cap timeout at 120 seconds
  return Math.min(timeout, 120000);
};

/**
 * Creates a throttled progress reporter function that only calls the original
 * function at most once per the specified interval
 * 
 * @param callback The original progress callback function
 * @param interval Minimum time in ms between callback invocations (default: 200ms)
 * @returns A throttled version of the callback function
 */
export const createThrottledProgressReporter = (
  callback: (progress: number) => void,
  interval: number = 200
): ((progress: number) => void) => {
  let lastCallTime = 0;
  let lastProgress = 0;
  let timeoutId: number | null = null;
  
  return (progress: number) => {
    const now = Date.now();
    lastProgress = progress;
    
    // If we haven't called recently, call immediately
    if (now - lastCallTime >= interval) {
      lastCallTime = now;
      callback(progress);
      return;
    }
    
    // Otherwise, schedule a call after the interval has passed
    if (timeoutId === null) {
      timeoutId = window.setTimeout(() => {
        lastCallTime = Date.now();
        callback(lastProgress);
        timeoutId = null;
      }, interval - (now - lastCallTime));
    }
  };
};

/**
 * Helper function to fix ARIA accessibility issues with hidden elements
 */
export const fixAriaAccessibility = (): void => {
  try {
    // Find elements with aria-hidden="true" that might contain focusable elements
    const ariaHiddenElements = document.querySelectorAll('[aria-hidden="true"]');
    
    ariaHiddenElements.forEach(el => {
      // Check if this element contains any focusable elements
      const focusableElements = el.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      
      if (focusableElements.length > 0) {
        // Apply inert attribute instead of aria-hidden for better accessibility
        el.setAttribute('inert', '');
        el.removeAttribute('aria-hidden');
      }
    });
  } catch (error) {
    console.error('Error fixing ARIA accessibility:', error);
  }
};
