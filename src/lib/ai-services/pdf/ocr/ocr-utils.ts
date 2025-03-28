
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
