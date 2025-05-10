
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
        // Only remove aria-hidden if the element isn't part of a modal dialog
        // This prevents removing aria-hidden where it's actually needed
        const isPartOfDialog = el.closest('[role="dialog"]') || 
                              el.closest('[role="alertdialog"]') ||
                              el.closest('[data-radix-popper-content-wrapper]');
                              
        if (!isPartOfDialog) {
          el.removeAttribute('aria-hidden');
          logInfo('Fixed ARIA accessibility issue', { 
            element: el.tagName, 
            focusableCount: focusableElements.length 
          });
        }
      }
    });
    
    // Also check for scroll-locked body
    const body = document.body;
    if (body && body.hasAttribute('data-scroll-locked')) {
      body.removeAttribute('data-scroll-locked');
      logInfo('Removed scroll lock from body', {});
    }
    
  } catch (error) {
    logError('Error fixing ARIA accessibility', { error });
  }
};

// Register DOM events for accessibility fixes
export const registerAccessibilityFixes = (): void => {
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', fixAriaAccessibility);
    window.addEventListener('load', fixAriaAccessibility);
    // Also run periodically to catch dynamically added elements
    setInterval(fixAriaAccessibility, 2000);
  }
};
