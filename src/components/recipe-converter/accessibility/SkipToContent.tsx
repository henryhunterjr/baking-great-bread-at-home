
import React, { useState } from 'react';

/**
 * Skip to content component that helps keyboard users bypass navigation
 * Only visible when focused
 */
const SkipToContent: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Find the main content area
    const mainContent = document.querySelector('main, [role="main"], #main-content');
    if (mainContent instanceof HTMLElement) {
      // Set tabindex so we can focus it
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      // Clean up tabindex after focus
      setTimeout(() => mainContent.removeAttribute('tabindex'), 100);
    }
  };

  return (
    <a
      href="#main-content"
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 transform z-50 
        bg-bread-700 text-white px-4 py-2 rounded-md
        transition-opacity duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-bread-400
        ${isFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={handleClick}
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
