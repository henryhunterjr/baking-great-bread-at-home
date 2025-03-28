
import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component that enhances responsiveness for recipe components
 * by adjusting layouts and styles based on screen size
 */
const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({ 
  children, 
  className = ''
}) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  
  const baseClass = 'transition-all duration-300 ease-in-out';
  
  // Determine responsive classes based on screen size
  const responsiveClass = isMobile
    ? 'space-y-4 px-2'
    : isTablet
    ? 'space-y-5 px-4'
    : 'space-y-6 px-6';
    
  return (
    <div className={`${baseClass} ${responsiveClass} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveWrapper;
