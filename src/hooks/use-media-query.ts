
import { useState, useEffect } from 'react';

/**
 * Hook for responsive design that listens to media query changes
 * 
 * @param query CSS media query string (e.g., '(max-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false for SSR
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Define listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);
  
  return matches;
}

/**
 * Preset breakpoints for common screen sizes
 */
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  
  // Inverse (max-width) queries
  smDown: '(max-width: 639px)',
  mdDown: '(max-width: 767px)',
  lgDown: '(max-width: 1023px)',
  xlDown: '(max-width: 1279px)',
  '2xlDown': '(max-width: 1535px)',
};

/**
 * Hook for using preset breakpoints
 * 
 * @param size Breakpoint name from predefined list
 * @returns boolean indicating if the breakpoint matches
 */
export function useBreakpoint(size: keyof typeof breakpoints): boolean {
  return useMediaQuery(breakpoints[size]);
}
