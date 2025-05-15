
import { useState, useEffect } from 'react';

// Media query breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type Breakpoint = keyof typeof breakpoints;
type BreakpointWithSuffix = `${Breakpoint}${'Up' | 'Down'}`;

/**
 * Hook to check if the current viewport matches a media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

/**
 * Hook to check if the viewport is at a specific breakpoint
 */
export function useBreakpoint(breakpoint: BreakpointWithSuffix | Breakpoint): boolean {
  // Handle 'smUp', 'mdDown', etc. format
  if (breakpoint.endsWith('Up') || breakpoint.endsWith('Down')) {
    const size = breakpoint.slice(0, -2) as Breakpoint;
    const isUp = breakpoint.endsWith('Up');
    const query = isUp 
      ? `(min-width: ${breakpoints[size]}px)` 
      : `(max-width: ${breakpoints[size] - 1}px)`;
    
    return useMediaQuery(query);
  }
  
  // Handle direct breakpoint match (e.g., 'sm', 'md')
  const minWidth = breakpoints[breakpoint as Breakpoint];
  const maxWidth = breakpoints[
    Object.keys(breakpoints)[Object.keys(breakpoints).indexOf(breakpoint as string) + 1]
  ] as number;
  
  const query = maxWidth
    ? `(min-width: ${minWidth}px) and (max-width: ${maxWidth - 1}px)`
    : `(min-width: ${minWidth}px)`;
  
  return useMediaQuery(query);
}
