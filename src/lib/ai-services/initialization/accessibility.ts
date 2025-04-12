
import { logInfo, logError } from '@/utils/logger';

/**
 * Fix for ARIA accessibility issue with nav elements
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
        
        logInfo('Fixed ARIA accessibility issue', { 
          element: el.tagName, 
          focusableCount: focusableElements.length 
        });
      }
    });
  } catch (error) {
    logError('Error fixing ARIA accessibility', { error });
  }
};

// Register DOM events for accessibility fixes
export const registerAccessibilityFixes = (): void => {
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', fixAriaAccessibility);
    window.addEventListener('load', fixAriaAccessibility);
  }
};
