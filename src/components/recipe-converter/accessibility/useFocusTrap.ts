import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus within a container - useful for modals, dialogs, and other components
 * that need to trap focus for accessibility purposes
 * 
 * @param active Whether the focus trap is active
 * @param returnFocusOnUnmount Element to return focus to when unmounted
 * @returns A ref to attach to the container element
 */
export function useFocusTrap<T extends HTMLElement>(
  active: boolean = true,
  returnFocusOnUnmount: HTMLElement | null = null
) {
  const containerRef = useRef<T>(null);
  
  useEffect(() => {
    if (!active) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Save the element that had focus before opening the dialog
    const previouslyFocused = returnFocusOnUnmount || document.activeElement as HTMLElement;
    
    // Find all focusable elements within the container
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus the first element
    setTimeout(() => {
      firstElement.focus();
    }, 50);
    
    // Handle tab key to keep focus within the container
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      // If shift+tab and on the first element, go to the last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      
      // If tab and on the last element, go to the first element
      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    // Add event listener for keydown
    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Remove event listener
      container.removeEventListener('keydown', handleKeyDown);
      
      // Return focus to the element that had focus before opening the dialog
      if (previouslyFocused && 'focus' in previouslyFocused) {
        setTimeout(() => {
          previouslyFocused.focus();
        }, 50);
      }
    };
  }, [active, returnFocusOnUnmount]);
  
  return containerRef;
}

export default useFocusTrap;
