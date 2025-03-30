
import React, { useEffect, useRef } from 'react';
import { logInfo } from '@/utils/logger';
import SkipToContent from './SkipToContent';

interface AccessibilityManagerProps {
  children: React.ReactNode;
}

/**
 * Component that enhances accessibility throughout the application
 * by managing focus, keyboard navigation, and ARIA attributes
 */
const AccessibilityManager: React.FC<AccessibilityManagerProps> = ({ children }) => {
  const previousPath = useRef<string | null>(null);
  
  useEffect(() => {
    // Fix common accessibility issues when component mounts
    fixAriaAttributes();
    enhanceTabIndex();
    enhanceFocusStyles();
    
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
    
    // Watch for route changes to manage focus
    const currentPath = window.location.pathname;
    if (previousPath.current && previousPath.current !== currentPath) {
      // Focus the main content when navigating to a new page
      setTimeout(() => {
        const mainContent = document.querySelector('main, [role="main"], #main-content');
        if (mainContent instanceof HTMLElement) {
          mainContent.setAttribute('tabindex', '-1');
          mainContent.focus({ preventScroll: false });
          // Remove tabindex after focus to prevent focus ring from showing when clicking elsewhere
          setTimeout(() => mainContent.removeAttribute('tabindex'), 100);
        }
      }, 100);
    }
    previousPath.current = currentPath;
    
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
      
      // Slash key for search focus
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !isInputFocused()) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"], [role="searchbox"]');
        if (searchInput instanceof HTMLElement) {
          searchInput.focus();
        }
      }
      
      // Add navigation shortcuts
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.location.href = '/';
      }
      
      if (e.altKey && e.key === 'r') {
        e.preventDefault();
        window.location.href = '/recipes';
      }
      
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        window.location.href = '/recipe-converter';
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Check if an input element is currently focused
  const isInputFocused = () => {
    const element = document.activeElement;
    return element instanceof HTMLInputElement || 
           element instanceof HTMLTextAreaElement || 
           element instanceof HTMLSelectElement ||
           element?.hasAttribute('contenteditable');
  };
  
  return (
    <>
      <SkipToContent />
      {children}
    </>
  );
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
    
    // Fix dropdown menus
    document.querySelectorAll('[role="menu"]').forEach(menu => {
      if (!(menu instanceof HTMLElement)) return;
      
      // Ensure menu items have proper roles
      menu.querySelectorAll('li, a, button').forEach(item => {
        if (!(item instanceof HTMLElement)) return;
        
        if (!item.hasAttribute('role')) {
          item.setAttribute('role', 'menuitem');
        }
        
        if (!item.hasAttribute('tabindex')) {
          item.setAttribute('tabindex', '0');
        }
      });
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
    
    // Ensure cards and other clickable containers can be accessed with keyboard
    document.querySelectorAll('.card, .card-hover').forEach(card => {
      if (!(card instanceof HTMLElement)) return;
      
      const clickableArea = card.querySelector('a, button');
      if (!clickableArea && card.hasAttribute('data-clickable') && !card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            
            const link = card.querySelector('a');
            if (link instanceof HTMLAnchorElement) {
              link.click();
            } else {
              card.click();
            }
          }
        });
      }
    });
    
    logInfo('Accessibility: Enhanced tabindex attributes');
  } catch (error) {
    logInfo('Accessibility: Error enhancing tabindex', { error });
  }
};

/**
 * Enhances focus styles to make them more visible
 */
const enhanceFocusStyles = () => {
  try {
    // Apply base focus styles if not already present
    const styleTag = document.getElementById('accessibility-focus-styles');
    if (!styleTag) {
      const style = document.createElement('style');
      style.id = 'accessibility-focus-styles';
      style.textContent = `
        :focus:not(:focus-visible) {
          outline: none;
        }
        
        :focus-visible {
          outline: 2px solid hsl(var(--primary)) !important;
          outline-offset: 2px !important;
          border-radius: 0.25rem !important;
          transition: outline-offset 0.1s ease !important;
        }
        
        .dark :focus-visible {
          outline: 2px solid hsl(var(--bread-400)) !important;
        }
        
        button:focus-visible, 
        [role="button"]:focus-visible,
        a:focus-visible {
          box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--primary)) !important;
          outline: none !important;
        }
        
        .dark button:focus-visible,
        .dark [role="button"]:focus-visible,
        .dark a:focus-visible {
          box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--bread-400)) !important;
        }
      `;
      document.head.appendChild(style);
      logInfo('Accessibility: Added focus styles');
    }
  } catch (error) {
    logInfo('Accessibility: Error adding focus styles', { error });
  }
};

export default AccessibilityManager;
