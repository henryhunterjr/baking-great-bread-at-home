
import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'smDown' | 'mdDown' | 'lgDown' | 'xlDown';

const breakpointMap = {
  xs: '(max-width: 639px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  // Down variants
  smDown: '(max-width: 639px)',
  mdDown: '(max-width: 767px)',
  lgDown: '(max-width: 1023px)',
  xlDown: '(max-width: 1279px)',
};

export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // First check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia(breakpointMap[breakpoint]);
      
      // Set initial value
      setMatches(mediaQuery.matches);
      
      // Define listener
      const handleChange = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
      };
      
      // Add listener
      mediaQuery.addEventListener('change', handleChange);
      
      // Remove listener on cleanup
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [breakpoint]);

  return matches;
};
