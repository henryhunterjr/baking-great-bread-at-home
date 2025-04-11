
import { useState, useEffect, useRef } from 'react';
import { TOUR_STEPS } from '../TourSteps';

export const useTourPositioning = (showTour: boolean, currentStep: number) => {
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Handle positioning and visibility of the tooltip
  useEffect(() => {
    if (!showTour) return;
    
    const handlePositioning = () => {
      const step = TOUR_STEPS[currentStep];
      const target = document.querySelector(step.target);
      
      if (target) {
        setTargetElement(target);
        const rect = target.getBoundingClientRect();
        const tooltipHeight = tooltipRef.current?.offsetHeight || 150;
        const tooltipWidth = tooltipRef.current?.offsetWidth || 300;
        
        // Calculate position based on placement
        let top = 0;
        let left = 0;
        
        // Adjust position based on specified placement
        switch (step.placement) {
          case 'top':
            top = rect.top - tooltipHeight - 12;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'bottom':
            top = rect.bottom + 12;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'left':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.left - tooltipWidth - 12;
            break;
          case 'right':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.right + 12;
            break;
          default:
            top = rect.bottom + 12;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        }
        
        // Ensure tooltip stays within viewport boundaries
        if (left < 20) left = 20;
        if (left + tooltipWidth > window.innerWidth - 20) {
          left = window.innerWidth - tooltipWidth - 20;
        }
        
        // Fix for tooltips appearing below the viewport
        if (top < 20) top = 20;
        if (top + tooltipHeight > window.innerHeight - 20) {
          // Instead of pushing it down, try to reposition above the element if there's room
          if (rect.top > tooltipHeight + 20) {
            top = rect.top - tooltipHeight - 12;
          } else {
            // If not enough room above, put it at a visible position in the viewport
            top = window.innerHeight - tooltipHeight - 20;
          }
        }
        
        setPosition({ top, left });
        
        // Always scroll the target element into view with better positioning
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    };
    
    // Initial positioning
    handlePositioning();
    
    // Reposition on window resize and scroll events
    window.addEventListener('resize', handlePositioning);
    window.addEventListener('scroll', handlePositioning);
    
    // Add mutation observer to detect DOM changes
    const observer = new MutationObserver(handlePositioning);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true 
    });
    
    // Set a small delay to ensure proper positioning after initial render
    const positionTimer = setTimeout(() => {
      handlePositioning();
    }, 200);
    
    return () => {
      window.removeEventListener('resize', handlePositioning);
      window.removeEventListener('scroll', handlePositioning);
      observer.disconnect();
      clearTimeout(positionTimer);
    };
  }, [showTour, currentStep]);

  return { targetElement, position, tooltipRef };
};
