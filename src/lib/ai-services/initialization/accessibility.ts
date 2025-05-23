
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
    
    // Always ensure body doesn't have data-scroll-locked when it shouldn't
    const body = document.body;
    if (body && body.hasAttribute('data-scroll-locked')) {
      // Check if there are any open dialogs or sheets before removing
      const openDialogs = document.querySelectorAll('[data-state="open"][role="dialog"]');
      
      if (openDialogs.length === 0) {
        body.removeAttribute('data-scroll-locked');
        logInfo('Removed scroll lock from body', {});
      }
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
    // Run more frequently to catch any scroll lock issues
    setInterval(fixAriaAccessibility, 1000);
    
    // Also run on any state changes that might affect dialogs
    document.addEventListener('click', () => {
      setTimeout(fixAriaAccessibility, 100);
    });
  }
};
