
import { useState, useEffect } from 'react';

// Define breakpoint sizes
const breakpoints = {
  xsDown: '(max-width: 575.98px)',
  smDown: '(max-width: 767.98px)',
  mdDown: '(max-width: 991.98px)',
  lgDown: '(max-width: 1199.98px)',
  xlDown: '(max-width: 1399.98px)',
  smUp: '(min-width: 576px)',
  mdUp: '(min-width: 768px)',
  lgUp: '(min-width: 992px)',
  xlUp: '(min-width: 1200px)',
  xxlUp: '(min-width: 1400px)'
};

type BreakpointKey = keyof typeof breakpoints;

/**
 * Hook to check if a media query matches
 * @param query Media query string or breakpoint key
 * @returns boolean indicating if the query matches
 */
export const useMediaQuery = (query: string): boolean => {
  // Check if window is available (for SSR)
  const isClient = typeof window !== 'undefined';
  
  const [matches, setMatches] = useState(
    isClient ? window.matchMedia(query).matches : false
  );
  
  useEffect(() => {
    if (!isClient) return;
    
    const mediaQuery = window.matchMedia(query);
    
    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };
    
    // Set initial value
    updateMatches();
    
    // Add listener for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMatches);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(updateMatches);
    }
    
    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMatches);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(updateMatches);
      }
    };
  }, [query, isClient]);
  
  return matches;
};

/**
 * Hook to check if a specific breakpoint matches
 * @param breakpoint The breakpoint key to check
 * @returns boolean indicating if the breakpoint matches
 */
export const useBreakpoint = (breakpoint: BreakpointKey): boolean => {
  return useMediaQuery(breakpoints[breakpoint]);
};

/**
 * Hook to determine the current active breakpoint
 * @returns The current active breakpoint
 */
export const useActiveBreakpoint = (): string => {
  const isXs = useMediaQuery(breakpoints.xsDown);
  const isSm = useMediaQuery(breakpoints.smUp) && useMediaQuery(breakpoints.mdDown);
  const isMd = useMediaQuery(breakpoints.mdUp) && useMediaQuery(breakpoints.lgDown);
  const isLg = useMediaQuery(breakpoints.lgUp) && useMediaQuery(breakpoints.xlDown);
  const isXl = useMediaQuery(breakpoints.xlUp) && useMediaQuery(breakpoints.xxlUp);
  const isXxl = useMediaQuery(breakpoints.xxlUp);
  
  if (isXxl) return 'xxl';
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  return 'xs';
};

export default useMediaQuery;
