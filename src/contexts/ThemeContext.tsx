
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => null,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then fall back to system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      return savedTheme || 'system';
    }
    return 'system';
  });

  // Function to get the actual theme based on system preference
  const getActualTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  // Apply theme to document on initial render and when theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    const actualTheme = getActualTheme();
    
    // Remove both classes first
    root.classList.remove('dark', 'light');
    
    // Add the appropriate class
    root.classList.add(actualTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    console.log('Theme updated:', actualTheme);
  }, [theme]);

  // Listen for system preferences change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        const root = document.documentElement;
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        
        root.classList.remove('dark', 'light');
        root.classList.add(newTheme);
        
        console.log('System theme preference changed:', newTheme);
      };
      
      // Initial check
      handleChange();
      
      // Add event listener for changes
      try {
        // Modern browsers
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } catch (error) {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
