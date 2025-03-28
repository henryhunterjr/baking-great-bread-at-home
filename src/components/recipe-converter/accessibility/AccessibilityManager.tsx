
import React, { useEffect } from 'react';
import { logInfo } from '@/utils/logger';

interface AccessibilityManagerProps {
  children: React.ReactNode;
}

/**
 * Component that enhances accessibility throughout the application
 * by managing focus, keyboard navigation, and ARIA attributes
 */
const AccessibilityManager: React.FC<AccessibilityManagerProps> = ({ children }) => {
  useEffect(() => {
    // Fix common accessibility issues when component mounts
    fixAriaAttributes();
    enhanceTabIndex();
    
    // Re-apply fixes when DOM changes
    const observer = new MutationObserver((mutations) => {
      // Only run on significant DOM changes
      const significantChanges = mutations.some(mutation => 
        mutation.type === 'childList' && mutation.addedNodes.length > 0);
      
      if (significantChanges) {
        fixAriaAttributes();
        enhanceTabIndex();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Add keyboard navigation for modal dialogs and dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle escape key for closing modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]:not([aria-hidden="true"])');
        if (modals.length > 0) {
          const closeButton = modals[modals.length - 1].querySelector('[aria-label="Close"]');
          if (closeButton && closeButton instanceof HTMLElement) {
            closeButton.click();
          }
        }
      }
      
      // Add more keyboard shortcuts as needed
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return <>{children}</>;
};

/**
 * Fixes missing ARIA attributes throughout the document
 */
const fixAriaAttributes = () => {
  try {
    // Fix elements with role="button" but no tabindex
    document.querySelectorAll('[role="button"]:not([tabindex])').forEach(el => {
      if (el instanceof HTMLElement && !el.hasAttribute('disabled')) {
        el.setAttribute('tabindex', '0');
      }
    });
    
    // Fix images without alt text
    document.querySelectorAll('img:not([alt])').forEach(el => {
      if (el instanceof HTMLImageElement) {
        // Use filename as fallback alt text
        const src = el.getAttribute('src') || '';
        const filename = src.split('/').pop()?.split('?')[0] || '';
        const fallbackAlt = filename.replace(/[_-]/g, ' ').replace(/\.\w+$/, '');
        
        el.setAttribute('alt', fallbackAlt || 'Image');
      }
    });
    
    // Fix form elements without labels
    document.querySelectorAll('input, select, textarea').forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      
      const id = el.getAttribute('id');
      if (!id) return;
      
      const hasLabel = document.querySelector(`label[for="${id}"]`);
      if (!hasLabel && !el.getAttribute('aria-label')) {
        // Use placeholder or name as fallback
        const placeholder = el.getAttribute('placeholder');
        const name = el.getAttribute('name');
        if (placeholder) {
          el.setAttribute('aria-label', placeholder);
        } else if (name) {
          el.setAttribute('aria-label', name.replace(/[_-]/g, ' '));
        }
      }
    });
    
    logInfo('Accessibility: Fixed ARIA attributes');
  } catch (error) {
    logInfo('Accessibility: Error fixing ARIA attributes', { error });
  }
};

/**
 * Enhances tabindex for better keyboard navigation
 */
const enhanceTabIndex = () => {
  try {
    // Find clickable elements without proper tabindex
    document.querySelectorAll('div[onclick], span[onclick]').forEach(el => {
      if (el instanceof HTMLElement && !el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
        
        // Add keyboard event handler if missing
        if (!el.hasAttribute('onkeydown')) {
          el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              el.click();
            }
          });
        }
      }
    });
    
    logInfo('Accessibility: Enhanced tabindex attributes');
  } catch (error) {
    logInfo('Accessibility: Error enhancing tabindex', { error });
  }
};

export default AccessibilityManager;
